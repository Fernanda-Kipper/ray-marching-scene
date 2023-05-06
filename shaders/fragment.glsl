uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
float PI = 3.1459;

float sdSphere(vec3 p, float r){
    return length(p) - r;
}

float map(vec3 p){
    return sdSphere(p, 0.4);
}

vec3 calcNormal(in vec3 p)
{
    const float eps = 0.0001;
    const vec2 h = vec2(eps,0);
    return normalize( vec3(map(p+h.xyy) - map(p-h.xyy),
                           map(p+h.yxy) - map(p-h.yxy),
                           map(p+h.yyx) - map(p-h.yyx) ) );
}


void main(){
    vec2 newUv = (vUv - vec2(0.5) * resolution.zw + vec2(0.5));
    vec3 camPos = vec3(0., 0., 2.);
    vec3 ray = normalize(vec3(vUv - vec2(0.4), -1));

    vec3 rayPos = camPos;
    float scalarValue = 0.;
    // none object will be further then 5
    float scalarMax = 5.;
    float rayDistanceToPoint = 0.;

    for(int i=0; i<256;++i){
        vec3 pos = camPos + scalarValue * ray;
        rayDistanceToPoint = map(pos);
        if(rayDistanceToPoint < 0000.1 || scalarValue > scalarMax) break;
        scalarValue += rayDistanceToPoint;
    }

    vec3 color = vec3(0.);
    if(scalarValue < scalarMax){
        vec3 pos = camPos + rayDistanceToPoint * ray;
        color = vec3(1.);
        vec3 normal = calcNormal(pos);
        color = normal;
        float diff = dot(vec3(1.), normal);
        color = vec3(diff);
    }

    gl_FragColor = vec4(color, 1.);
}