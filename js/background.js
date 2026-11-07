(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var COUNT = 70;        // 粒子数量
    var LINK_DIST = 170;   // 连线距离
    var SPEED = 0.35;      // 移动速度
    var LINK_ALPHA = 0.45; // 线条最大不透明度
    var LINE_WIDTH = 1.2;  // 线条粗细

    var W = 0, H = 0, particles = [];

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function paint(alpha) {
      var dark = document.body.classList.contains('dark-theme');
      return 'rgba(' + (dark ? '230,230,230,' : '70,70,70,') + alpha + ')';
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d;

      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = paint(0.55);
        ctx.fill();
      }

      for (i = 0; i < particles.length; i++) {
        for (j = i + 1; j < particles.length; j++) {
          p = particles[i];
          q = particles[j];
          dx = p.x - q.x;
          dy = p.y - q.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = paint((1 - d / LINK_DIST) * LINK_ALPHA);
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    init();
    frame();

    window.addEventListener('resize', function () {
      resize();
      init();
    });
  });
})();
