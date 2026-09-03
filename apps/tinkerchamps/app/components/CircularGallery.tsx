"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";

type GL = Renderer["gl"];

interface Item {
  image: string;
}

interface Props {
  items: Item[];
  bend?: number;
}

class Media {
  plane!: Mesh;
  program!: Program;

  width = 0;
  widthTotal = 0;
  x = 0;
  extra = 0;

  constructor(
    private gl: GL,
    private geometry: Plane,
    private scene: Transform,
    private viewport: { width: number; height: number },
    private screen: { width: number; height: number },
    private item: Item,
    private index: number,
    private length: number,
    private bend: number,
  ) {
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.item.image;

    img.onload = () => {
      texture.image = img;

      texture.minFilter = this.gl.LINEAR_MIPMAP_LINEAR;
      texture.magFilter = this.gl.LINEAR;

      this.program.uniforms.uImageSize.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };

    this.program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragment: `
        precision highp float;

        uniform sampler2D tMap;
        uniform vec2 uImageSize;
        uniform vec2 uPlaneSize;
        uniform float uBorderRadius;

        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r){
          vec2 d = abs(p) - b;
          return length(max(d,0.0)) + min(max(d.x,d.y),0.0) - r;
        }

        void main(){

          float imageAspect = uImageSize.x / uImageSize.y;
          float planeAspect = uPlaneSize.x / uPlaneSize.y;

          vec2 ratio = vec2(1.0);

          // object-fit: cover — scale so the image fills the plane, cropping excess
          if (planeAspect > imageAspect) {
            // plane is wider than image: fit width, crop height
            ratio.y = imageAspect / planeAspect;
          } else {
            // plane is taller than image: fit height, crop width
            ratio.x = planeAspect / imageAspect;
          }

          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 color = texture2D(tMap, uv);

          vec2 p = vUv - 0.5;

          float d = roundedBoxSDF(p, vec2(0.5 - uBorderRadius), uBorderRadius);

          float alpha = 1.0 - smoothstep(0.0, 0.003, d);

          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uImageSize: { value: [1, 1] },
        uPlaneSize: { value: [1, 1] },
        uBorderRadius: { value: 0.06 },
      },
      transparent: true,
    });
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.plane.setParent(this.scene);
  }

  update(scroll: { current: number }, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    const B = Math.abs(this.bend);
    const R = (H * H + B * B) / (2 * B);

    const effectiveX = Math.min(Math.abs(x), H);
    const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);

    this.plane.position.y = -arc;
    this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;

    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && isBefore) this.extra -= this.widthTotal;
    if (direction === "left" && isAfter) this.extra += this.widthTotal;
  }

  onResize() {
    const isMobile = window.innerWidth < 768;

    const scale = isMobile
      ? this.screen.height / 2200
      : this.screen.height / 1500;

    const baseHeight = isMobile ? 1000 : 1100;
    const baseWidth = isMobile ? 750 : 850;

    this.plane.scale.y =
      (this.viewport.height * (baseHeight * scale)) / this.screen.height;

    this.plane.scale.x =
      (this.viewport.width * (baseWidth * scale)) / this.screen.width;

    this.width = this.plane.scale.x + (isMobile ? 1 : 1);
    this.widthTotal = this.width * this.length;

    this.x = this.width * this.index;

    this.program.uniforms.uPlaneSize.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }
}

class App {
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;

  planeGeometry!: Plane;
  medias: Media[] = [];

  scroll = { current: 0, target: 0, last: 0, position: 0 };

  screen = { width: 0, height: 0 };
  viewport = { width: 0, height: 0 };

  raf = 0;

  isDown = false;
  start = 0;

  constructor(
    private container: HTMLElement,
    private items: Item[],
    private bend: number,
  ) {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.update();
    this.addEvents();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    this.gl = this.renderer.gl;

    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl);
  }

  createMedias() {
    // For 20+ images, no need to double — only double if items count is small
    const repeated =
      this.items.length < 10 ? [...this.items, ...this.items] : [...this.items];

    this.medias = repeated.map(
      (item, i) =>
        new Media(
          this.gl,
          this.planeGeometry,
          this.scene,
          this.viewport,
          this.screen,
          item,
          i,
          repeated.length,
          this.bend,
        ),
    );
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });

    const fov = (this.camera.fov * Math.PI) / 180;

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = { width, height };

    this.medias.forEach((media) => media.onResize());
  };

  update = () => {
    // Increased lerp factor for smoother, more responsive scroll
    this.scroll.current += (this.scroll.target - this.scroll.current) * 0.12;

    const direction = this.scroll.current > this.scroll.last ? "right" : "left";

    this.medias.forEach((media) => media.update(this.scroll, direction));

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    this.scroll.last = this.scroll.current;

    this.raf = requestAnimationFrame(this.update);
  };

  onDown = (e: MouseEvent | TouchEvent) => {
    this.isDown = true;
    // Capture current scroll position at the moment of press to avoid jump
    this.scroll.position = this.scroll.current;
    this.scroll.target = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  onMove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDown) return;

    const x = "touches" in e ? e.touches[0].clientX : e.clientX;

    const distance = (this.start - x) * (window.innerWidth < 768 ? 0.2 : 0.2);

    this.scroll.target = this.scroll.position + distance;
  };

  onUp = () => {
    this.isDown = false;
  };

  addEvents() {
    window.addEventListener("resize", this.onResize);

    window.addEventListener("wheel", (e) => {
      this.scroll.target += e.deltaY * 0.02;
    });

    window.addEventListener("mousedown", this.onDown);
    window.addEventListener("mousemove", this.onMove);
    window.addEventListener("mouseup", this.onUp);

    window.addEventListener("touchstart", this.onDown);
    window.addEventListener("touchmove", this.onMove);
    window.addEventListener("touchend", this.onUp);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);

    if (this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({ items, bend = 3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const isMobile = window.innerWidth < 768;

    const app = new App(ref.current, items, isMobile ? bend * 0.5 : bend);

    return () => app.destroy();
  }, [items, bend]);

  return (
    <div
      ref={ref}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
    />
  );
}
