// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameEvents {
    // Direction: 0=forward, 1=back, 2=left, 3=right
    event Move(
        address indexed player,
        uint8 direction,
        uint256 x,
        uint256 z,
        uint256 timestamp
    );
    event GameStart(address indexed player, uint256 timestamp);
    event GameOver(address indexed player, uint256 score, uint256 timestamp);

    function recordMove(uint8 direction, uint256 x, uint256 z) external {
        emit Move(msg.sender, direction, x, z, block.timestamp);
    }

    function startGame() external {
        emit GameStart(msg.sender, block.timestamp);
    }

    function endGame(uint256 score) external {
        emit GameOver(msg.sender, score, block.timestamp);
    }
}
