const radToDeg = rad => rad * 180 / Math.PI;

const degToRad = deg => deg * Math.PI / 180;

const computeMatrix = (matrix, config, time) => {
    if (animation)
      nodeInfosByName[selectedObject].trs.rotation[1] = degToRad(time * 3)

    matrix.trs.translation = [config.translationX, config.translationY, config.translationZ]
    matrix.trs.rotation = [config.rotationX, config.rotationY, config.rotationZ]
    matrix.trs.scale = [config.scaleX, config.scaleY, config.scaleZ]

    
    return time
}

const calculateNormal = (position, indices) => {
    let pontos = []
    let faces = []
    let resultado
    
    for (let i = 0; i < position.length; i += 3) {
        pontos.push([position[i], position[i+1],position[i+2]])
    }
    
    for (let i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i+1],indices[i+2]])
    }

    var normalUsadas = {}

    for (let i = 0, j = 0; i < position.length; i+=3, j++) {
        normalUsadas[j] = []
    }

    normal = faces.map(item => {
        // AB AC
        vetorA1 = [pontos[item[1]][0] - pontos[item[0]][0], pontos[item[1]][1] - pontos[item[0]][1], pontos[item[1]][2] - pontos[item[0]][2]]
        vetorB1 = [pontos[item[2]][0] - pontos[item[0]][0], pontos[item[2]][1] - pontos[item[0]][1], pontos[item[2]][2] - pontos[item[0]][2]]

        // BA BC
        vetorB2 = [pontos[item[0]][0] - pontos[item[1]][0], pontos[item[0]][1] - pontos[item[1]][1], pontos[item[0]][2] - pontos[item[1]][2]]
        vetorA2 = [pontos[item[2]][0] - pontos[item[1]][0], pontos[item[2]][1] - pontos[item[1]][1], pontos[item[2]][2] - pontos[item[1]][2]]

        // CA CB
        vetorA3 = [pontos[item[0]][0] - pontos[item[2]][0], pontos[item[0]][1] - pontos[item[2]][1], pontos[item[0]][2] - pontos[item[2]][2]]
        vetorB3 = [pontos[item[1]][0] - pontos[item[2]][0], pontos[item[1]][1] - pontos[item[2]][1], pontos[item[1]][2] - pontos[item[2]][2]]

        produto = [
            vetorA1[1] * vetorB1[2] - vetorB1[1] * vetorA1[2],
            vetorB1[0] * vetorA1[2] - vetorA1[0] * vetorB1[2],
            vetorA1[0] * vetorB1[1] - vetorB1[0] * vetorA1[1],

            vetorA2[1] * vetorB2[2] - vetorB2[1] * vetorA2[2],
            vetorB2[0] * vetorA2[2] - vetorA2[0] * vetorB2[2],
            vetorA2[0] * vetorB2[1] - vetorB2[0] * vetorA2[1],

            vetorA3[1] * vetorB3[2] - vetorB3[1] * vetorA3[2],
            vetorB3[0] * vetorA3[2] - vetorA3[0] * vetorB3[2],
            vetorA3[0] * vetorB3[1] - vetorB3[0] * vetorA3[1]
        ]

        let distancia = []

        for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
            distancia.push(Math.abs(Math.sqrt(produto[i] * produto[i] + produto[i+1] * produto[i+1] + produto[i+2] * produto[i+2])))

            produto[i] = produto[i] / distancia[j]
            produto[i+1] = produto[i+1] / distancia[j]
            produto[i+2] = produto[i+2] / distancia[j]
        }

        for (let i = 0, j = 0; i < produto.length; i+=3, j++) {
            if (normalUsadas[item[0]].length == 0) {
                normalUsadas[item[0]] = [produto[i], produto[i+1], produto[i+2]]
            } else {
                if (normalUsadas[item[1]].length == 0) {
                    normalUsadas[item[1]] = [produto[i], produto[i+1], produto[i+2]]
                } else {
                    normalUsadas[item[2]] = [produto[i], produto[i+1], produto[i+2]]
                }
            }
        }
   
        return produto
    })


    let normaisTratadas = []

    for (const item in normalUsadas) {
        for (let i = 0; i < normalUsadas[item].length; i++) {
            normaisTratadas.push(normalUsadas[item][i])
        }
    }

    return normaisTratadas;
}

const playerMoviment = event => {
    updateScene()
    if(!gameOver)
    {
        if (event.code === 'ArrowRight') {
        if (config.translationX <= 32)
            config.translationX += 1
        }
        else if (event.code === 'ArrowLeft') {
        if (config.translationX >= -32)
            config.translationX -= 1
        }
        else if (event.code === 'Space') {
            const shoot = {
                name: `shoot-${index}`,
                draw: true,
                translation: [nodeInfosByName['player'].trs.translation[0], nodeInfosByName['player'].trs.translation[1] + 2, nodeInfosByName['player'].trs.translation[2]],
                bufferInfo: cubeBufferInfo,
                vertexArray: cubeVAO,
                children:[],
                scale: [0.5, 0.5, 0.5],
            }
        sceneDescription.children[2].children.push(shoot)

        nodeInfosByName = {}
        objectsToDraw = []
        objects = []

        scene = makeNode(sceneDescription);

        index++
        flag = true

        }
//         else if (event.code === 'ArrowUp'){
//             if (config.translationY <= 32)
//                 config.translationY +=1
//         }
//         else if (event.code === 'ArrowDown'){
//             if (config.translationY >= -32)
//                 config.translationY -=1
//         }
    }
}

function collision (obj1, obj2)
{
    if(
        obj1.trs.translation[0] + obj1.trs.scale[0] >= obj2.trs.translation[0] - obj2.trs.scale[0] &&
        obj1.trs.translation[0] - obj1.trs.scale[0] <= obj2.trs.translation[0] + obj2.trs.scale[0]
    )
    {
        if(
            obj1.trs.translation[1] + 1 >= obj2.trs.translation[1] -1 &&
            obj1.trs.translation[1] - 1 <= obj2.trs.translation[1] +1
        )
        {
            obj1.trs.translation = [200, 200, 200]
            obj2.trs.translation = [200, 200, 200]
            return true
        }
    }
    
}

function enemyAnimation(value)
{
    if(value == 1)
    {
        for(let i = 0; i < 32; i++)
      {
        nodeInfosByName[`b${i}`].trs.translation[0] += deltaTime * speed
        dummy += deltaTime * speed
      }
      for(let i = 0; i < 8; i++)
        {
            arrayColumn[i] += deltaTime * speed
        }
    }
    else if( value == 2)
    {
        for(let i = 0; i < 32; i++)
      {
        nodeInfosByName[`b${i}`].trs.translation[1] -= 4
      }
      enemyY -= 4
    }
}

function enemyShoot(index)
{
    updateScene()
    const shoot = {
        name: `shootEnemy-${enemyIndex}`,
        draw: true,
        translation: [arrayColumn[index], enemyY, nodeInfosByName['player'].trs.translation[2]],
        bufferInfo: cubeBufferInfo,
        vertexArray: cubeVAO,
        children:[],
        scale: [0.5, 0.5, 0.5],
    }

    sceneDescription.children[3].children.push(shoot)

    nodeInfosByName = {}
    objectsToDraw = []
    objects = []

    enemyIndex++
    enemyFlag = true

    console.log("alo")

    scene = makeNode(sceneDescription);
}

function updateScene() {
    const updatedValues = sceneDescription.children.map(item => {
        let name = item.name;
        const updatedValues2 = item.children.map((item2, index) => {
            let name2 = item2.name;
            item2.translation = nodeInfosByName[name2].trs.translation;
            item2.rotation = nodeInfosByName[name2].trs.rotation;
            item2.index = nodeInfosByName[name2].trs.index;
            item2.type = nodeInfosByName[name2].trs.type;
            item2.format = nodeInfosByName[name2].format;

            return item2;
        })

        item.translation = nodeInfosByName[name].trs.translation;
        item.rotation = nodeInfosByName[name].trs.rotation;
        item.index = nodeInfosByName[name].trs.index;
        item.type = nodeInfosByName[name].trs.type;
        item.format = nodeInfosByName[name].format;

        return item;
    })

    sceneDescription.children = [...updatedValues];
}
