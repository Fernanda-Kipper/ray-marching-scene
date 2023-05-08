uniform float time;
uniform float progress;
uniform vec2 mouse;
uniform float balls;
uniform sampler2D matcap;
uniform vec4 resolution;
varying vec2 vUv;
float PI = 3.1459;

vec2 getmatcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdSphere(vec3 p, float r){
    return length(p) - r;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float random(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float sdf(vec3 p){
    vec3 p1 = rotate(p, vec3(1.), time/12.);

    // float box = smin(sdTorus(p1, vec2(0.2)), sdSphere(p, 0.3), 0.1);
    float box = sdTorus(p1, vec2(0.2));
    float mouseSphere = sdSphere(p - vec3(mouse * resolution.zw, 0), 0.2);
    
    float final = smin(box, mouseSphere, 0.1);
    for(float i=0.; i < balls; i++) {
        float randOffset = random(vec2(i, 0.));
        float progress = fract(time /2. + randOffset);
        vec3 pos = vec3(sin(randOffset * 2. * PI), cos(randOffset * 2. * PI), 0.);
        float goToCenter = sdSphere(p - pos * progress, 0.1);
        final = smin(final, goToCenter, 0.1);
    }

    return final;
}

vec3 calcNormal(in vec3 p)
{
    const float eps = 0.0001;
    const vec2 h = vec2(eps,0);
    return normalize(vec3(sdf(p+h.xyy) - sdf(p-h.xyy),
                           sdf(p+h.yxy) - sdf(p-h.yxy),
                           sdf(p+h.yyx) - sdf(p-h.yyx) ) );
}

void main(){
    float dist = length(vUv - vec2(0.5));
    vec3 bg = mix(vec3(1.), vec3(0.7), dist);
    vec2 newUv = ((vUv - vec2(0.5)) * resolution.zw + vec2(0.5));
    vec3 camPos = vec3(0., 0., 2.);
    vec3 ray = normalize(vec3((vUv - vec2(0.5))*resolution.zw, -1));

    float scalarValue = 0.;
    float scalarMax = 5.;

    for(int i=0; i<256;++i){
        vec3 pos = camPos + scalarValue * ray;
        float rayDistanceToPoint = sdf(pos);
        if(rayDistanceToPoint < 0.0001 || scalarValue > scalarMax) break;
        scalarValue += rayDistanceToPoint;
    }

    vec3 color = bg;
    if(scalarValue < scalarMax){
        vec3 pos = camPos + scalarValue * ray;
        vec3 normal = calcNormal(pos);
        float diff = dot(vec3(1.), normal);
        vec2 matcapUv = getmatcap(ray, normal);
        color = vec3(diff);
        color = texture2D(matcap, matcapUv).rgb;

        float fresnel = pow(1. + dot(ray, normal),1.);

        color = mix(color, bg, fresnel);
    }

    gl_FragColor = vec4(color, 1.);
}