var programInfo
var scene
var texture
var programInfoTexture

var deltaTime
var animationTime = 0
var then = 0
var speed = 10

var arrayColumn = []
var enemyY = 0

var dummy

var flag = false

var flagWin = false
var gameOver = false

var enemyFlag = false

var enemyIndex = 0
var enemyCount = 32

var sound = new Audio('sons/top.mp3')
sound.volume = 0.2

var soundGameOver = new Audio('sons/gameOver.mp3')
soundGameOver.volume = 0.2

var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var enemies = [];

var shootList = [];

var sceneDescription;

function makeNode(nodeDescription) {
    var trs = new TRS();
    var node = new Node(trs);
  
    nodeInfosByName[nodeDescription.name] = {
      trs: trs,
      node: node,
    };
  
    trs.translation = nodeDescription.translation || trs.translation;
    trs.rotation = nodeDescription.rotation || trs.rotation;
    trs.scale = nodeDescription.scale || trs.scale;
  
    if (nodeDescription.draw !== false) {
      
        node.drawInfo = {
            uniforms: {
                // u_colorOffset: [0, 0, 0.6, 0],
                // u_colorMult: [0.4, 0.4, 0.4, 1],
            },
            programInfo: programInfo,
            bufferInfo: nodeDescription.bufferInfo,
            vertexArray: nodeDescription.vertexArray,
        };
        objectsToDraw.push(node.drawInfo);
        objects.push(node);
    }
  
    makeNodes(nodeDescription.children).forEach(function(child) {
        child.setParent(node);
      });
  
    return node;
  }
  
  const makeNodes = nodeDescriptions => nodeDescriptions ? nodeDescriptions.map(makeNode) : []

  function main() {

    const initialize = initializeWebgl()

    const keyboardListener = document.querySelector('body')
  
    keyboardListener.addEventListener('keydown', playerMoviment, false)

    const { gl } = initialize
  
    programInfo = initialize.programInfo
    programInfoTexture = twgl.createProgramInfo(gl, [vst, fst])

    const arrayCube = {
        position: { numComponents: 3, data: cubeFormat.position, },
        indices:{ numComponents: 3, data: cubeFormat.indices, },
        color: { numComponents: 4, data: cubeFormat.color, },
      };

    const arrayPyramid = {
      position: { numComponents: 3, data: pyramidFormat.position, },
      indices:{ numComponents: 3, data: pyramidFormat.indices, },
      color: { numComponents: 4, data: pyramidFormat.color, },
      };

    const arrayTriangle = {
      position: { numComponents: 3, data: triangleFormat.position, },
      indices:{ numComponents: 3, data: triangleFormat.indices, },
      color: { numComponents: 4, data: triangleFormat.color, },
      };

      arrayCube.normal = calculateNormal(cubeFormat.position, cubeFormat.indices);
      arrayPyramid.normal = calculateNormal(pyramidFormat.position, pyramidFormat.indices)
      arrayTriangle.normal = calculateNormal(triangleFormat.position, triangleFormat.indices)

      cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrayCube);
      pyramidBufferInfo = twgl.createBufferInfoFromArrays(gl,arrayPyramid);
      triangleBufferInfo = twgl.createBufferInfoFromArrays(gl, arrayTriangle)

      cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
      pyramidVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pyramidBufferInfo);
      triangleVAO = twgl.createVAOFromBufferInfo(gl, programInfo, triangleBufferInfo)

      texture = twgl.createTextures(gl, {clover: {src: "texture.png"}})

      const fieldOfViewRadians = degToRad(60);

    sceneDescription = {
        name: "World",
          draw: false,
          children: [
            {
              name: "player",
              draw: true,
              translation: [0, 0, 0],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children: [],
            },
            {
              name:"enemy",
              draw: false,
              translation: [0,0,0],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children:[],
            },
            {
              name: "shoot",
              draw: false,
              translation: [0, 0, 0],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children: [],
            },
            {
              name: "shootEnemy",
              draw: false,
              translation: [0, 0, 0],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children: [],
            },
            {
              name: "barrier",
              draw: false,
              translation: [0, 0, 0],
              bufferInfo: cubeBufferInfo,
              vertexArray: cubeVAO,
              children: [
                {
                  name:`barrier-0`,
                  draw: true,
                  translation: [-20, -12, 0],
                  children:[],
                  bufferInfo: cubeBufferInfo,
                  vertexArray: cubeVAO,
                  scale: [3,1,1],
                },
                {
                  name:`barrier-1`,
                  draw: true,
                  translation: [0, -12, 0],
                  children:[],
                  bufferInfo: cubeBufferInfo,
                  vertexArray: cubeVAO,
                  scale: [3,1,1],
                },
                {
                  name:`barrier-2`,
                  draw: true,
                  translation: [20, -12, 0],
                  children:[],
                  bufferInfo: cubeBufferInfo,
                  vertexArray: cubeVAO,
                  scale: [3,1,1],
                }
              ],
            }
        ],
      }

      function criarBlocos(){
        for(let i = 0; i < 32; i++){
          criaBloco(i);
        }
      }
      
      function criaBloco(i){
      
        if(i < 8){
          var block = {
            name:`b${i}`,
                draw: true,
                translation: [(i*-5) + 17.5,3,0],
                children:[],
                bufferInfo: cubeBufferInfo,
                vertexArray: cubeVAO,
                scale: [1,1,1],  
          }
        }
        else if(i>=8 && i <16)
        {
          var block = {
            name:`b${i}`,
                draw: true,
                translation: [((i-8)*-5) + 17.5,7,0],
                children:[],
                bufferInfo: cubeBufferInfo,
                vertexArray: cubeVAO,
                scale: [1,1,1],
          }
        }
        else if(i>=16 && i <24){
          var block = {
            name:`b${i}`,
                draw: true,
                translation: [((i-16)*-5) + 17.5,11,0],
                children:[],
                bufferInfo: cubeBufferInfo,
                vertexArray: cubeVAO,
                scale: [1,1,1],
          }
        }
        else if(i>=24 && i <32){
          var block = {
            name:`b${i}`,
                draw: true,
                translation: [((i-24)*-5) + 17.5,15,0],
                children:[],
                bufferInfo: cubeBufferInfo,
                vertexArray: cubeVAO,
                scale: [1,1,1],
          }
        }
        // else if(i>=32 && i <40){
        //   var block = {
        //     name:`b${i}`,
        //         draw: true,
        //         translation: [(i-32)*5,16,0],
        //         children:[],
        //         bufferInfo: cubeBufferInfo,
        //         vertexArray: cubeVAO,
        //         scale: [1,1,1],
        //   }
        // }
      
        sceneDescription.children[1].children.push(block)
      }

    criarBlocos();

    scene = makeNode(sceneDescription); //*
    dummy = nodeInfosByName[`b0`].trs.translation[0]

    arrayColumn.push(nodeInfosByName[`b0`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b1`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b2`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b3`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b4`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b5`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b6`].trs.translation[0])
    arrayColumn.push(nodeInfosByName[`b7`].trs.translation[0])

    enemyY = nodeInfosByName[`b8`].trs.translation[1]

    requestAnimationFrame(drawScene);
    loadGUI()

    function drawScene(time) {
      if(flag == true)
      {
        sound.play()
      }
      time *= 0.001
      deltaTime = time - then
      then = time

      if(!gameOver)
      { 
        if(flag)
        {
          if(dummy > 500 && speed > 0)
          {
            speed *= -1
          }
          else if(dummy < -500 && speed < 0)
          {
            speed *= -1
            enemyAnimation(2)
          }
          animationTime += deltaTime
          enemyAnimation(1)
    
          if(animationTime > 1)
          {
            enemyShoot(Math.floor(Math.random()* 8))
            animationTime = 0
          }
        }
        
        let aux = 0
        console.log(enemyCount)

        if (flag == true)
        {
          for(aux = 0; aux < index; aux++){
            if(nodeInfosByName[`shoot-${aux}`] != undefined)
              {
                nodeInfosByName[`shoot-${aux}`].trs.translation[1] += 0.4
              }
          }
          for(const lindo in nodeInfosByName)
          {
            if(lindo != "World" && lindo != "shoot" && lindo != "player" && lindo != "enemy" && lindo != "shootEnemy" && lindo != "barrier")
              {
                for(let i = 0; i < index; i++)
                {
                  if(nodeInfosByName[`shoot-${i}`] != undefined && lindo != `shoot-${i}`)
                  {
                    collision(nodeInfosByName[`shoot-${i}`], nodeInfosByName[lindo])                    
                  }
                }
              }
              if(lindo != "World" && lindo != "shoot" && lindo != "player" && lindo != "enemy" && lindo != "shootEnemy" && lindo != "barrier")
              {
                if(collision(nodeInfosByName["player"], nodeInfosByName[lindo]))
                {
                  gameOver = true
                }
              }
              if(lindo != "World" && lindo != "shoot" && lindo != "player" && lindo != "enemy" && lindo != "shootEnemy" && lindo != "barrier" && lindo != "barrier-0" && lindo != "barrier-1" && lindo != "barrier-2")
              {
                collision(nodeInfosByName["barrier-0"], nodeInfosByName[lindo])
                collision(nodeInfosByName["barrier-1"], nodeInfosByName[lindo])
                collision(nodeInfosByName["barrier-2"], nodeInfosByName[lindo])
              }
          }
        }
  
        if(enemyFlag == true)
        {
          for(let aux = 0; aux < enemyIndex; aux++)
          {
            if(nodeInfosByName[`shootEnemy-${aux}`] != undefined)
            {
              nodeInfosByName[`shootEnemy-${aux}`].trs.translation[1] -= 0.4
            }
          }
        }
        enemyCount = 0
        for(let i = 0; i < 32; i++)
        {
          if(nodeInfosByName[`b${i}`].trs.translation[0] > 100)
          {
            enemyCount++
          }
        }
        if(enemyCount == 32)
        {
          gameOver = true
          sound.volume = 0
          alert("ganho")
        }
      }
      else
      {
        soundGameOver.play()
        nodeInfosByName[`World`].trs.rotation[1] = time
        nodeInfosByName[`World`].trs.rotation[0] = time
      }

        if (gui == null)
            loadGUI()

        twgl.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.75, 0.85, 0.8, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Compute the projection matrix
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 200);

        // Compute the camera's matrix using look at.
        const cameraPosition = [config.cameraPositionX, config.cameraPositionY, 35];
        const target = [config.targetX, config.targetY, config.targetZ];
        const up = [0, 1, 0];

        const cameraMatrix = m4.lookAt(cameraPosition, target, up);
        const viewMatrix = m4.inverse(cameraMatrix);
        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        computeMatrix(nodeInfosByName[selectedObject], config)

        // nodeInfosByName[selectedObject].trs.rotation[1] = degToRad(time)

        // Update all world matrices in the scene graph
        scene.updateWorldMatrix();

        // Compute all the matrices for rendering
        objects.forEach(function(object) {
          object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);

          object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(degToRad(0)));
  
          object.drawInfo.uniforms.u_worldViewProjection = m4.multiply(viewProjectionMatrix, object.worldMatrix);
  
          object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));

          object.drawInfo.uniforms.u_color = [0.2, 1, 0.2, 1]
          // object.drawInfo.uniforms.u_color = [10.3, -5, 0.2, 1]

          object.drawInfo.uniforms.u_lightWorldPosition = [0, 0, 100]

          object.drawInfo.uniforms.u_lightWorldPosition2 = [50, 0, 100]

          object.drawInfo.uniforms.u_lightWorldPosition3 = [-50, 0, 100]

          object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition

          object.drawInfo.uniforms.u_shininess = 300

          object.drawInfo.uniforms.u_lightColor = [1, 0.6, 0.6]

          object.drawInfo.uniforms.u_lightColor2 = [30, 0.9, 0.2]

          object.drawInfo.uniforms.u_lightColor3 = [15, 0.9, 0.2]

          object.drawInfo.uniforms.u_specularColor = [2, 0.6, 0.6]

          object.drawInfo.uniforms.u_specularColor2 = [50, 30, 40]

          object.drawInfo.uniforms.u_specularColor3 = [70, 30, 40]
        });

        // ------ Draw the objects --------
        twgl.drawObjectList(gl, objectsToDraw);

        requestAnimationFrame(drawScene); //*
    }
  }

  main();