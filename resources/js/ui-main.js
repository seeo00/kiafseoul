(function () {
  const wallThickness = 80; // 벽의 두께 변수
  const matterContainer = document.querySelector('.sec-tag__cont');
  const matterCanvas = document.querySelector('.sec-tag__canvas');

  // 초기 셋팅
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Composite = Matter.Composite;

  let engine, render, runner;
  let domBodies = document.querySelectorAll('.tag__item');
  let matterBodies = {};
  let leftWall, rightWall, ground;

  function init() {
    if (render) return; // 이미 초기화된 경우 중복 실행 방지

    engine = Engine.create();
    render = Render.create({
      element: matterCanvas,
      engine: engine,
      background: 'transparent',
      options: {
        width: matterContainer.offsetWidth,
        height: matterContainer.offsetHeight,
        wireframes: false,
      },
    });

    createBounds();
    Composite.add(engine.world, [leftWall, rightWall, ground]);

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);

    createMatterBodies();
    World.add(engine.world, Object.values(matterBodies));

    window.requestAnimationFrame(updateElementPositions);
  }

  function destroy() {
    if (!render) return; // 초기화되지 않은 상태에서 호출 방지

    Matter.Render.stop(render);
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);

    render.canvas.remove();
    render = null; // render를 명시적으로 null로 설정
  }

  function createBounds() {
    ground = Bodies.rectangle(
      matterContainer.offsetWidth / 2,
      matterContainer.offsetHeight + wallThickness / 2,
      matterContainer.offsetWidth,
      wallThickness,
      { isStatic: true }
    );

    leftWall = Bodies.rectangle(
      0 - wallThickness / 2,
      matterContainer.offsetHeight / 2,
      wallThickness,
      matterContainer.offsetHeight * 5,
      { isStatic: true }
    );

    rightWall = Bodies.rectangle(
      matterContainer.offsetWidth + wallThickness / 2,
      matterContainer.offsetHeight / 2,
      wallThickness,
      matterContainer.offsetHeight * 5,
      { isStatic: true }
    );
  }

  function createMatterBodies() {
    domBodies = document.querySelectorAll('.tag__item');
    matterBodies = {};

    domBodies.forEach(function (domBody) {
      const matterBody = Bodies.rectangle(
        matterContainer.offsetWidth / 2,
        -matterContainer.offsetHeight,
        domBody.offsetWidth,
        domBody.offsetHeight,
        {
          chamfer: { radius: domBody.offsetHeight / 2 },
          restitution: 0.05,
          density: Math.random() * 5 + 1,
          angle: Math.random() * 10,
          friction: 1,
          frictionAir: Math.random() / 150,
        }
      );

      matterBody.sleepThreshold = Infinity; // 슬립 비활성화
      domBody.id = matterBody.id;
      matterBodies[matterBody.id] = matterBody;
    });
  }

  function updateElementPositions() {
    domBodies.forEach((domBody) => {
      const matterBody = matterBodies[domBody.id];
      if (matterBody) {
        domBody.style.transform =
          `translate( ${-domBody.offsetWidth + matterBody.position.x + domBody.offsetWidth / 2}px, ` +
          `${-domBody.offsetHeight + matterBody.position.y + domBody.offsetHeight / 2}px )` +
          ` rotate(${matterBody.angle}rad)`;
      }
    });

    window.requestAnimationFrame(updateElementPositions);
  }

  function handleResize() {
    if (!render || !render.canvas) return; // render 또는 canvas가 없으면 종료

    render.canvas.width = matterContainer.offsetWidth;
    render.canvas.height = matterContainer.offsetHeight;

    Matter.Render.setPixelRatio(render, window.devicePixelRatio);

    World.clear(engine.world, false);
    Composite.clear(engine.world, false);

    createBounds();
    Composite.add(engine.world, [leftWall, rightWall, ground]);

    createMatterBodies();
    World.add(engine.world, Object.values(matterBodies));
  }

  ScrollTrigger.create({
    trigger: '.sec-tag__cont',
    start: 'top 90%',
    end: 'bottom center',
    onEnter: () => init(),
    onLeave: () => destroy(),
    onEnterBack: () => init(),
    onLeaveBack: () => destroy(),
    //markers: true,
  });

  window.addEventListener('resize', () => {
    if (render) {
      handleResize();
      ScrollTrigger.refresh();
    }
  });
})();
