// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {SignatureVerification} from "./signatureutils.sol";
import "superfluid-contracts/contracts/apps/SuperTokenV1Library.sol";
import {ISuperToken} from "superfluid-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {ISuperfluidPool} from "superfluid-contracts/contracts/interfaces/agreements/gdav1/ISuperfluidPool.sol";


contract QuizyStream {
    uint256 public idcounter;

    using SuperTokenV1Library for ISuperToken;
    ISuperToken public superToken;

    PoolConfig private poolConfig = PoolConfig({
        transferabilityForUnitsOwner: true,
        distributionFromAnyAddress: true
    });


    constructor(ISuperToken _superToken) {

        superToken = _superToken;

    }

    struct Answer {
        string answer;
        uint256 timestamp;
        uint256 quiz_id;
        uint256 question_number;
        address player;
        bytes signature;
    }

    /// user to id to answer instance
    mapping(address => mapping(string => Answer)) public user_to_id_to_answer;

    /// id to quizinstance
    mapping(string => QuizInstance) public id_to_quizinstance;

    struct QuizInstance {
        address admin;
        uint256 start_time;
        uint256 end_time;
        /// no of questions
        uint8 questions_num;
        /// interval betweeen questions
        uint8 interval;
        /// players
        address[] players;
        bytes32[] questionanswerhash;
        ISuperfluidPool  pool;
    }

    function start_new_quiz(
        address admin,
        string memory id,
        uint256 start_time,
        uint256 end_time,
        uint8 question_num,
        uint8 interval,
        address[] memory players,
        bytes32[] memory hashes
    ) public {

        ISuperfluidPool pool = superToken.createPool((admin), poolConfig);
        QuizInstance memory quizinstance = QuizInstance({
            admin: admin,
            start_time: start_time,
            end_time: end_time,
            questions_num: question_num,
            interval: interval,
            players: players,
            questionanswerhash: hashes,
            pool: pool
        });
        id_to_quizinstance[id] = quizinstance;

    }

    function aggregate_answers(string memory quiz_id, uint256 question_number, Answer[] memory answer)
        external
        onlyAdmin(quiz_id)
    {

        QuizInstance memory quizinstance = id_to_quizinstance[quiz_id];
        require(question_number <= quizinstance.questions_num);
        for (uint256 i = 0; i < answer.length; i++) {
            // todo check if player signature is really a player in the quiz id 
            Answer memory answer_instance = answer[i];
            bytes32 messageHash = SignatureVerification.getMessageHash(answer_instance.answer, answer_instance.timestamp, answer_instance.quiz_id,answer_instance.question_number, answer_instance.player);
            bytes32 ethSignedMessageHash = SignatureVerification.getEthSignedMessageHash(messageHash);

            bool isverified =  SignatureVerification.recoverSigner(ethSignedMessageHash, answer_instance.signature) == answer_instance.player;

            if (isverified){
                payout(quizinstance.pool,answer_instance.player);
            }

        }
    }


    function payout(ISuperfluidPool pool,address player) public  {
        uint member_unit = pool.getUnits(player);
        updateMemberUnits(pool,player,uint128(member_unit));
    }

    function updateMemberUnits(ISuperfluidPool pool,address member, uint128 units) public {
        superToken.updateMemberUnits(pool, member, units);
    }


    modifier onlyAdmin(string memory id) {
        require(msg.sender == id_to_quizinstance[id].admin);

        _;
    }
}
