$( document ).ready( function(){
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  console.log( "DOM listo" );
  var renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let intersects;
  let justOnce = false;

  let light = new THREE.PointLight( 0xffffff, 1.3, 20, 0.5 );
  light.position.set( 0, 0, 10 );
  scene.add( light );

  let rig = new THREE.Object3D();
  scene.add( rig );

  let elementNumber = 9;
  let angleIncrement = 360/elementNumber;
  let radius = 3;
  let textures = [];

  let loader = new THREE.TextureLoader();
  textures[ 0 ] = loader.load('img/value_nicarbazin.png');//JAIME: aquí se cargan las imágenes para cada botón.
  textures[ 1 ] = loader.load('img/safety.png');//JAIME: te puedes guiar con esto para llenar el array de URLs
  textures[ 2 ] = loader.load('img/physical_aspects.png');
  textures[ 3 ] = loader.load('img/past_the_peak.png');
  textures[ 4 ] = loader.load('img/meta_analysis.png');
  textures[ 5 ] = loader.load('img/heat_stress.png');
  textures[ 6 ] = loader.load('img/extended_use.png');
  textures[ 7 ] = loader.load('img/competitors.png');
  textures[ 8 ] = loader.load('img/bio_shuttle.png');

  //JAIME: Aquí se cargan los URLs a los que lleva cada botón. El método que se usa para redirigir es window.location en la línea 97
  let urls = [ 'http://www.google.com', 'https://www.facebook.com', 'https://www.twitter.com', 'https://www.instagram.com', 'https://www.gmail.com', 'https://www.hbo.com', 'https://www.netflix.com', 'https://www.heroku.com', 'https://www.amazon.com' ];

  let floader = new THREE.FontLoader();



  for( let i = 0; i < elementNumber; i++ ){
    let geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    //let geometry = new THREE.SphereGeometry(0.5, 32, 32);

    let material = new THREE.MeshLambertMaterial( { map: textures[ i ], transparent: true } );
    let cube = new THREE.Mesh( geometry, material );
    cube.position.x = Math.sin( toRadians( i * angleIncrement ) ) * radius;
    cube.position.y = Math.cos( toRadians( i * angleIncrement ) ) * radius;
    cube.rotation.x = toRadians( 90 );
    cube.offpos = -0.1 + (Math.random() * 0.2);
    cube.position.z += cube.offpos;
    cube.offinc = 0.0003;
    cube.url = urls[ i ];
    rig.add( cube );
  }

  rig.rotation.x = toRadians( 130 );
  rig.position.y = 1.2;

  /*console.log( rig.children.length );
  for( let i = 0; i < rig.children.length; i++ ){
    console.log( rig.children[ i ] );
  }*/



  camera.position.z = 5;

  var animate = function () {
    requestAnimationFrame( animate );

    for( let i = 0; i < rig.children.length; i++ ){
      rig.children[ i ].lookAt( camera.position );
      if( rig.children[ i ].position.z >= 0.1 || rig.children[ i ].position.z <= -0.1 ){
        rig.children[ i ].offinc *= -1;
      }
      rig.children[ i ].position.z += rig.children[ i ].offinc;
    }



    //rig.rotation.z += 0.01;

    // update the picking ray with the camera and mouse position
	  raycaster.setFromCamera( mouse, camera );

	  // calculate objects intersecting the picking ray
	  intersects = raycaster.intersectObjects( rig.children );


    if( justOnce ){
      for ( var i = 0; i < intersects.length; i++ ) {
        window.location = intersects[ i ].object.url; //JAIME: en esta línea se redirige hacia la URL del botón que tocaste. VueJS ofrece otros métodos para esto: this.$router.push('www.yoursite.com/blog'); this.$router.push('blog');
        justOnce = false;
      }
    }

    renderer.render( scene, camera );
  };

  $( window ).keyup( function( e ){
    if( e.code == 'ArrowRight' ){
      rotateRig( angleIncrement * -1, rig );

    }

    if( e.code == 'ArrowLeft' ){
      rotateRig( angleIncrement, rig );
    }
  });

  $( ".btnLeft" ).on( 'touchend', function(){
    $( this ).addClass( 'pushDown1' );
    rotateRig( angleIncrement, rig );
    setTimeout( function(){
      $( '.btnLeft' ).removeClass( 'pushDown1' );
    }, 500);
  });

  $( ".btnRight" ).on( 'touchend', function(){
    rotateRig( angleIncrement * -1, rig );
    $( this ).addClass( 'pushDown2' );
    setTimeout( function(){
      $( '.btnRight' ).removeClass( 'pushDown2' );
    }, 500);
  });



  animate();




  function onTouchEnd( event ) {

  	// calculate mouse position in normalized device coordinates
  	// (-1 to +1) for both components




  	mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
  	mouse.y = - ( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1;

    justOnce = true;

  }

  window.addEventListener( 'touchend', onTouchEnd, false );

});



function toRadians( degrees ){
  return degrees * (Math.PI/180);
}

let isActive = false;

function rotateRig( rotation_req, object ){
  console.log( object );
  let id;
  let initialRotation = 0;
  let actualRotation = 0;
  let originalRotation = object.rotation.z;

  function animateRig() {

      id = requestAnimationFrame( animateRig );

      if( rotation_req > 0 && actualRotation < rotation_req ){
        object.rotation.z += 0.03;
        actualRotation += 0.03;
      }

      if( rotation_req < 0 && actualRotation > rotation_req ){
        object.rotation.z -= 0.03;
        actualRotation -= 0.03;
      }
        //console.log( Math.abs( toRadians(rotation_req) ) + ', ' + Math.abs( actualRotation ) );

      if( Math.abs( toRadians( rotation_req ) ) <= Math.abs( actualRotation ) ){
        object.rotation.z = originalRotation + toRadians( rotation_req );
        cancelAnimationFrame( id );
        isActive = false;
      }

  }

  if( !isActive){
    isActive = true;
    animateRig( rotation_req );
  }
}
