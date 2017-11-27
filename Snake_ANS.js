var canvas;
var gl;
var posManLoc, posMan = vec2(  0,  0 );
var directLoc, direct = vec2(  0,  0 );
var pre_directLoc, pre_direct = vec2(  0,  0 );

var colors = [
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var vertices = [
    vec2( -0.05, -0.05 ),
    vec2( -0.05,  0.05 ),
    vec2(  0.05,  0.05 ),
    vec2(  0.05, -0.05 )
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColor );
    
    posManLoc = gl.getUniformLocation( program, "posMan" );
    directLoc = gl.getUniformLocation( program, "direction" );
    pre_directLoc = gl.getUniformLocation( program, "predirection" );


    window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);

        switch( key ) {
          case 'w': case 'W':
            if (posMan[1] > 0.89) break;
            posMan[1] += 0.1;
            pre_direct = direct;
            direct = vec2(  0,  1 );
            break;

          case 'a': case 'A':
            if (posMan[0] < -0.89) break;
            posMan[0] -= 0.1;
            pre_direct = direct;
            direct = vec2(  -1,  0 );
            break;

          case 's': case 'S':
            if (posMan[1] < -0.89) break;
            posMan[1] -= 0.1;
            pre_direct = direct;
            direct = vec2(  0,  -1 );
            break;

          case 'd': case 'D':
            if (posMan[0] > 0.89) break;
            posMan[0] += 0.1;
            pre_direct = direct;
            direct = vec2(  1,  0 );
            break;
        }
    };
    render();
};

function render() {    
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform2fv( posManLoc, posMan );
    gl.uniform2fv( directLoc, vec2(  0,  0 ) );
    gl.uniform2fv( pre_directLoc, vec2(  0,  0 ) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    gl.uniform2fv( directLoc, direct );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    gl.uniform2fv( directLoc, direct );
    gl.uniform2fv( pre_directLoc, pre_direct );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    window.requestAnimFrame(render);
}
