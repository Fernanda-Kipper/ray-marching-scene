import * as THREE from 'three';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

import matcap from './buble-texture.png'

// init
export default class Sketch {
  constructor(){
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    console.log(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.time = 0;
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.addMesh();
    this.resize();
    this.render();
    this.mouseEvents();

    window.addEventListener('resize', this.resize.bind(this));
  }

    resize(){
      var w = window.innerWidth;
      var h = window.innerHeight;
      this.renderer.setSize( w, h );
      this.camera.aspect = w / h;
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
        // progress: {
        //   type: "f",
        //   value: 0
        // },
        // side: THREE.DoubleSide
      }
    })
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );
  }

  render(){
    this.time += 0.5;
  
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



// export default class Sketch{
//   constructor(selector){
//     this.scene =  new THREE.Scene();

//     this.renderer = new THREE.WebGLRenderer();

//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     this.renderer.setSize(window.innerWidth, window.innerWidth);
//     this.renderer.setClearColor( 0xeeeeee, 1 );

//     this.container = document.getElementById('container');
//     this.container.appendChild(this.renderer.domElement);

//     // this.camera = new THREE.PerspectiveCamera(
//     //   70,
//     //   window.innerWidth / window.innerHeight,
//     //   0.001, 1000
//     // );

//     var frustumSize = 10;
//     var aspect = window.innerWidth / window.innerHeight;
//     this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );

//     this.camera.position.set( 0, 0, 4 );
//     this.camera.position.set( 13.684753056578113,-13.182186046164112,  10.5066061768662773 );
//     this.camera.position.set( 1,1,0 );
//     this.camera.lookAt(0,0,0);
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.time = 0;

//     this.colors = [
//        new THREE.Color( 0x588c73 ),
//        new THREE.Color( 0xf2e394 ),
//        new THREE.Color( 0xf2ae72 ),
//        new THREE.Color( 0xd96459 ),
//        new THREE.Color( 0x8c4646 ),
//        // new THREE.Color( 0xe20019 ),
//     ]


    
//     this.setupResize();
    

//     this.resize();
//     this.addObjects();
//     this.animate();
//     // this.settings();

//   }

//   settings() {
//     // @todo cut geometry to change number of dots
//     let that = this;
//     this.settings = {
//       time: 0,
//       amplitude: 1,
//       diffAmplitude: 1,
//       period1: 1,
//       period2: 1,
//       perlinAmplitude: 1,
//       timeSpeed: 1,
//       oneWave: 1000,
//       size: 5,
//       fly:function() { alert('fly') }
//     };
//     this.gui = new dat.GUI();
//     this.gui.add(this.settings, 'time',0,100,0.01);
//     this.gui.add(this.settings, 'amplitude',0,10,0.01);
//     this.gui.add(this.settings, 'diffAmplitude',0,10,0.01);
//     this.gui.add(this.settings, 'period1',0,10,0.01);
//     this.gui.add(this.settings, 'period2',0,10,0.01);
//     this.gui.add(this.settings, 'timeSpeed',0,1,0.001);
//     this.gui.add(this.settings, 'perlinAmplitude',0,10,0.01);
//     this.gui.add(this.settings, 'oneWave',1000,100000,100);
//     this.gui.add(this.settings, 'size',0.1,200,0.1);
//     this.gui.add(this.settings,'fly').name('Test fly');
//   }
  

//   setupResize(){
//     window.addEventListener('resize', this.resize.bind(this)); 
//   }

//   resize(){
//     var w = window.innerWidth;
//     var h = window.innerHeight;
//     this.renderer.setSize( w, h );
//     this.camera.aspect = w / h;
//     this.camera.updateProjectionMatrix();
//   }



//   render(){
//     this.renderer.render(this.scene, this.camera);
//   }





//   addObjects(){
//     let that = this;
//     let number = 10;
//     this.material = new THREE.ShaderMaterial( {
//       extensions: {
//           derivatives: '#extension GL_OES_standard_derivatives : enable',
//       },
//       side: THREE.DoubleSide,
//       uniforms: {
//         time: { type: 'f', value: 0 },
//         offset: { type: 'f', value: 0 },
//         color: { type: 'c', value: 0 },
//         back: { type: 'i', value: 0 },
//       },
//       // wireframe: true,
//       // transparent: true,
//       vertexShader: vertex,
//       fragmentShader: fragment
//     });

//     // this.material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true});

//     this.geometry =  new THREE.PlaneGeometry( 1, 1, 1,1 );
//     this.geometry =  new THREE.CylinderBufferGeometry( 2, 2, 1, 4, 1, true );

//     this.instanceGeo = new THREE.InstancedBufferGeometry();

//     let vertices = this.geometry.attributes.position.clone();
//     this.instanceGeo.addAttribute('position', vertices);
//     this.instanceGeo.attributes.uv = this.geometry.attributes.uv;
//     this.instanceGeo.attributes.normal = this.geometry.attributes.normal;
//     this.instanceGeo.index = this.geometry.index;

//     console.log(this.instanceGeo,this.geometry);

//     let instancePositions = [];
//     let instanceColors = [];
//     let instanceOffsets = [];
//     for (let i = 0; i < number; i++) {
//       instancePositions.push(
//         0,
//         i - 5,
//         0
//       );
//       instanceColors.push(
//         this.colors[i%5].r,
//         this.colors[i%5].g,
//         this.colors[i%5].b,
//       );
//       instanceOffsets.push(i);
//     }

//     this.instanceGeo.addAttribute('instancePosition', new THREE.InstancedBufferAttribute(
//       new Float32Array(instancePositions), 3
//     ))
//     this.instanceGeo.addAttribute('instanceColor', new THREE.InstancedBufferAttribute(
//       new Float32Array(instanceColors), 3
//     ))
//     this.instanceGeo.addAttribute('instanceOffset', new THREE.InstancedBufferAttribute(
//       new Float32Array(instanceOffsets), 1
//     ))
    

//     this.mats = [];

//     this.instanceMesh = new THREE.Mesh(this.instanceGeo,this.material);
//     this.scene.add(this.instanceMesh);


//   }



//   animate(){
//     this.time += 0.05;
//      this.material.uniforms.time.value = this.time;
//      // this.instanceGeo.uniforms.time.value = this.time;


//      if(this.mats.length){
//       this.mats.forEach(e=>{
//         e.uniforms.time.value = this.time;
//         // console.log(e.uniforms.offset.value);
//       })
//      }
//     requestAnimationFrame(this.animate.bind(this));
//     this.render();
//   }
// }

// new Sketch('container');