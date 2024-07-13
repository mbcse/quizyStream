// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {SignatureVerification} from "./signatureutils.sol";
import "superfluid-contracts/contracts/apps/SuperTokenV1Library.sol";
import {ISuperToken} from "superfluid-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import {ISuperfluidPool} from "superfluid-contracts/contracts/interfaces/agreements/gdav1/ISuperfluidPool.sol";

contract QuizyStream {
    using SuperTokenV1Library for ISuperToken;

    ISuperToken public superToken;

    PoolConfig private poolConfig = PoolConfig({transferabilityForUnitsOwner: false, distributionFromAnyAddress: true});

    constructor(ISuperToken _superToken) {
        superToken = _superToken;
    }

    struct Answer {
        string answer;
        string question;
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
        int96 flowrate;
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
        ISuperfluidPool pool;
    }

    function start_new_quiz(
        int96 flowrate,
        address admin,
        string memory id,
        uint256 start_time,
        uint256 end_time,
        uint8 question_num,
        uint8 interval,
        address[] memory players,
        bytes32[] memory hashes
    ) public {
        require(id_to_quizinstance[id].start_time == 0, "same id ");
        ISuperfluidPool pool = superToken.createPool((address(this)), poolConfig);
        QuizInstance memory quizinstance = QuizInstance({
            flowrate: flowrate,
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
        for (uint i = 0; i  < players.length; i++){
            updateMemberUnits(pool, players[i], uint128(1));
        }
        distributeFlow(pool, flowrate);
    }

    function pooladdress(string memory quizid) public view returns (address) {
        return address(id_to_quizinstance[quizid].pool);
    }

    function distributeFlow(ISuperfluidPool pool, int96 flowRate) public {
        superToken.distributeFlow(address(this), pool, flowRate);

    }

    function aggregate_answers(
        string memory quiz_id,
        uint256 question_number,
        Answer[] memory answer,
        uint256 questionsalt,
        string memory correct_question,
        string memory correct_answer
    ) external onlyAdmin(quiz_id) {
        QuizInstance memory quizinstance = id_to_quizinstance[quiz_id];
        require(question_number <= quizinstance.questions_num);
        require(
            quizinstance.questionanswerhash[question_number - 1]
                == keccak256(abi.encode(correct_question, correct_answer, questionsalt))
        );
        for (uint256 i = 0; i < answer.length; i++) {
            // todo check if player signature is really a player in the quiz id

            Answer memory answer_instance = answer[i];
            bytes32 messageHash = SignatureVerification.getMessageHash(
                answer_instance.answer,
                answer_instance.timestamp,
                answer_instance.quiz_id,
                answer_instance.question_number,
                answer_instance.player
            );
            bytes32 ethSignedMessageHash = SignatureVerification.getEthSignedMessageHash(messageHash);

            bool isverified = SignatureVerification.recoverSigner(ethSignedMessageHash, answer_instance.signature)
                == answer_instance.player;

            if (isverified) {
                payout(
                    quizinstance.pool,
                    answer_instance.player,
                    correct_answer,
                    correct_question,
                    answer_instance.answer,
                    answer_instance.question
                );
            }
        }
    }

    function payout(
        ISuperfluidPool pool,
        address player,
        string memory correct_answer,
        string memory correct_question,
        string memory playeranswer,
        string memory playerquestion
    ) public {
        uint256 member_unit = pool.getUnits(player);
        /// players answer is correct
        if (
            keccak256(abi.encode(correct_answer, correct_question))
                == keccak256(abi.encode(playeranswer, playerquestion))
        ) {
            // increase 10% flow
            uint256 new_unit = (member_unit * 110) / 100;
            updateMemberUnits(pool, player, uint128(new_unit));
        }
        // player answer is incorrect
        else {
            // reduce 10% flow
            uint256 new_unit = (member_unit * 90) / 100;
            updateMemberUnits(pool, player, uint128(new_unit));
        }
    }

    function updateMemberUnits(ISuperfluidPool pool, address member, uint128 units) public {
        superToken.updateMemberUnits(pool, member, units);
    }

    modifier onlyAdmin(string memory id) {
        require(msg.sender == id_to_quizinstance[id].admin);

        _;
    }

    function connectPool(string memory quizid) public {
        ISuperfluidPool pool = id_to_quizinstance[quizid].pool;
        superToken.connectPool(pool);
    }
}
