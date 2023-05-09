import * as THREE from 'three';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

import matcap from './assets/buble-texture.png';

// init
export default class Sketch {
  constructor(){
    this.audio = document.getElementById("audio");

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio(window.devicePixelRatio);
 
    document.getElementById("container").appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.001, 1000 );
    this.camera.position.z = 1;

    let frustumSize = 1;
    this.camera = new THREE.OrthographicCamera(frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000);
    this.camera.position.set(0, 0, 2);

    this.scene = new THREE.Scene();

    this.time = 0;
    this.clock = 0.1;
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.addMesh();
    this.resize();
    this.render();
    this.mouseEvents();

    window.addEventListener('resize', this.resize.bind(this));
    document.getElementById('play-btn').addEventListener('click', this.play.bind(this))
  }

    play(){
      this.material.uniforms.balls.value = 5;
      this.audio.load();
      this.audio.play();

      setTimeout(() => {
        this.clock = 0.15;
      }, 7000)

      setTimeout(() => {
        this.clock = 0.2;
      }, 9500)

      setTimeout(() => {
        this.clock = 0.1;
      }, 13000)

      setTimeout(() => {
        this.clock = 0.05;
      }, 20000)

      setTimeout(() => {
        this.clock = 0.15;
      }, 21000)

      setTimeout(() => {
        this.clock = 0.05;
      }, 24000)

      setTimeout(() => {
        this.clock = 0.15;
      }, 25000)
    }

    resize(){
      var w = window.innerWidth;
      var h = window.innerHeight;
      this.renderer.setSize( w, h );
      this.camera.aspect = w / h;

      this.imageAspect = 1;
      let a1,a2;
      if(this.height/this.width > this.imageAspect){
        a1 = (this.width / this.height) * this.imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (this.height / this.width) * this.imageAspect;
      }

      this.material.uniforms.resolution.value.x = this.width;
      this.material.uniforms.resolution.value.y = this.height;
      this.material.uniforms.resolution.value.z = a1;

      this.camera.updateProjectionMatrix();
    }

  mouseEvents(){
    this.mouse = new THREE.Vector2();
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = event.pageX / this.width - 0.5;
      this.mouse.y = - event.pageY / this.height + 0.5;
    })
  }

  addMesh(){
    this.geometry = new THREE.PlaneGeometry(1, 1);
    //this.material = new THREE.MeshNormalMaterial({color: 0xffff00, side: THREE.DoubleSide});

    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        time: { type: "f", value: 0 },
        mouse: { value: new THREE.Vector2(0,0)},
        matcap: { value: new THREE.TextureLoader().load(matcap)},
        resolution: { value: new THREE.Vector4() },
        balls: { value: 0 }
        // progress: {
        //   type: "f",
        //   value: 0
        // },
        // side: THREE. DoubleSide
      }
    })
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );
  }

  render(){
    this.time += this.clock;
  
    // Atualizando o valor da propriedade 'time' do material do mesh
    this.mesh.material.uniforms.time.value = this.time;

    if(this.mouse) {
      // Atualizando a posição do mouse dentro do material do mesh
      this.mesh.material.uniforms.mouse.value = this.mouse;
    }
  
    // Atualize a rotação do mesh, se desejar
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;
  
    this.renderer.render( this.scene, this.camera );
    window.requestAnimationFrame(this.render.bind(this));
  };
}
new Sketch();