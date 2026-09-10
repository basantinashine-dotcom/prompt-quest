// Self-contained so the same tested engine can run inside the downloaded file.
export function createPongEngine(winningScore = 5) {
  const width = 800,
    height = 450,
    paddleHeight = 84,
    paddleWidth = 12,
    radius = 8;
  const state = {
    phase: 'ready' as 'ready' | 'playing' | 'paused' | 'over',
    difficulty: 'normal' as 'easy' | 'normal',
    playerY: 183,
    computerY: 183,
    playerScore: 0,
    computerScore: 0,
    ball: { x: 400, y: 225, vx: 330, vy: 110 },
    delay: 0.7,
    winner: '' as '' | 'player' | 'computer',
  };
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  function serve(direction: number) {
    state.ball = {
      x: width / 2,
      y: height / 2,
      vx: direction * 330,
      vy: (state.playerScore + state.computerScore) % 2 ? -110 : 110,
    };
    state.delay = 0.7;
  }
  function restart() {
    state.phase = 'ready';
    state.playerScore = 0;
    state.computerScore = 0;
    state.playerY = state.computerY = (height - paddleHeight) / 2;
    state.winner = '';
    serve(1);
  }
  function start() {
    if (state.phase === 'over') restart();
    state.phase = 'playing';
  }
  function pause() {
    if (state.phase === 'playing') state.phase = 'paused';
  }
  function step(seconds: number, direction = 0, targetY: number | null = null) {
    const events: Array<'hit' | 'point' | 'win'> = [];
    if (state.phase !== 'playing') return events;
    let remaining = clamp(seconds, 0, 0.05);
    while (remaining > 0 && state.phase === 'playing') {
      const dt = Math.min(remaining, 1 / 120);
      remaining -= dt;
      state.playerY = clamp(
        targetY === null
          ? state.playerY + direction * 420 * dt
          : targetY - paddleHeight / 2,
        0,
        height - paddleHeight,
      );
      const aiTarget =
        state.ball.vx > 0
          ? state.ball.y - paddleHeight / 2
          : (height - paddleHeight) / 2;
      const aiSpeed = state.difficulty === 'easy' ? 150 : 235;
      state.computerY = clamp(
        state.computerY +
          clamp(aiTarget - state.computerY, -aiSpeed * dt, aiSpeed * dt),
        0,
        height - paddleHeight,
      );
      if (state.delay > 0) {
        state.delay = Math.max(0, state.delay - dt);
        continue;
      }
      const ball = state.ball;
      const previousX = ball.x;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.y < radius) {
        ball.y = radius;
        ball.vy = Math.abs(ball.vy);
      }
      if (ball.y > height - radius) {
        ball.y = height - radius;
        ball.vy = -Math.abs(ball.vy);
      }
      const leftFace = 28 + paddleWidth + radius,
        rightFace = width - 28 - paddleWidth - radius;
      const hitPlayer =
        ball.vx < 0 &&
        previousX >= leftFace &&
        ball.x <= leftFace &&
        ball.y >= state.playerY - radius &&
        ball.y <= state.playerY + paddleHeight + radius;
      const hitComputer =
        ball.vx > 0 &&
        previousX <= rightFace &&
        ball.x >= rightFace &&
        ball.y >= state.computerY - radius &&
        ball.y <= state.computerY + paddleHeight + radius;
      if (hitPlayer || hitComputer) {
        const paddleY = hitPlayer ? state.playerY : state.computerY;
        const offset = clamp(
          (ball.y - paddleY - paddleHeight / 2) / (paddleHeight / 2),
          -1,
          1,
        );
        const speed = Math.min(620, Math.hypot(ball.vx, ball.vy) * 1.045);
        ball.vx = (hitPlayer ? 1 : -1) * speed * Math.cos(offset * 0.9);
        ball.vy = speed * Math.sin(offset * 0.9);
        ball.x = hitPlayer ? leftFace : rightFace;
        events.push('hit');
      }
      if (ball.x < -radius || ball.x > width + radius) {
        const playerScored = ball.x > width;
        if (playerScored) state.playerScore++;
        else state.computerScore++;
        events.push('point');
        if (
          state.playerScore >= winningScore ||
          state.computerScore >= winningScore
        ) {
          state.phase = 'over';
          state.winner = playerScored ? 'player' : 'computer';
          events.push('win');
        } else serve(playerScored ? -1 : 1);
      }
    }
    return events;
  }
  return {
    state,
    width,
    height,
    paddleHeight,
    paddleWidth,
    radius,
    start,
    pause,
    restart,
    step,
  };
}
