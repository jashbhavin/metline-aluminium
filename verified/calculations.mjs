/** All geometry enters in millimetres, area in mm², density in kg/m³. */
export const shapes = {
 sheet:['length','width','thickness'], plate:['length','width','thickness'], foil:['length','width','thickness'],
 coil:['outerDiameter','innerDiameter','width'], 'round-bar':['diameter','length'], rod:['diameter','length'],
 'square-bar':['width','length'], 'rectangular-bar':['width','height','length'], 'flat-bar':['width','height','length'],
 'hexagonal-bar':['acrossFlats','length'], 'round-tube':['outerDiameter','thickness','length'], pipe:['outerDiameter','thickness','length'],
 'square-tube':['width','thickness','length'], 'rectangular-tube':['width','height','thickness','length'],
 angle:['width','height','thickness','length'], channel:['width','height','thickness','length'],
 'hollow-profile':['outerArea','voidArea','length'], disc:['diameter','thickness'], ring:['outerDiameter','innerDiameter','thickness'],
 'custom-section':['area','length']
};
function positive(v,name){if(!Number.isFinite(v)||v<=0)throw new RangeError(`${name} must be a finite number greater than zero.`);return v;}
function less(a,b,message){if(a>=b)throw new RangeError(message);}
export function weight(shape,input,density=2700,quantity=1){
 if(!shapes[shape])throw new RangeError('Unknown section.');positive(density,'Density');positive(quantity,'Quantity');if(!Number.isSafeInteger(quantity))throw new RangeError('Quantity must be a whole number.');
 for(const key of shapes[shape])positive(input[key],key);const p=input,t=p.thickness;let area,length=p.length;
 switch(shape){
 case 'sheet':case 'plate':case 'foil':area=p.width*t;break;
 case 'coil':case 'ring':less(p.innerDiameter,p.outerDiameter,'Inner diameter must be smaller than outer diameter.');area=Math.PI/4*(p.outerDiameter**2-p.innerDiameter**2);length=shape==='coil'?p.width:t;break;
 case 'round-bar':case 'rod':area=Math.PI*p.diameter**2/4;break;
 case 'square-bar':area=p.width**2;break;
 case 'rectangular-bar':case 'flat-bar':area=p.width*p.height;break;
 case 'hexagonal-bar':area=Math.sqrt(3)/2*p.acrossFlats**2;break;
 case 'round-tube':case 'pipe':less(2*t,p.outerDiameter,'Twice the wall thickness must be smaller than the outer diameter.');area=Math.PI/4*(p.outerDiameter**2-(p.outerDiameter-2*t)**2);break;
 case 'square-tube':case 'rectangular-tube':{const h=shape==='square-tube'?p.width:p.height;less(2*t,Math.min(p.width,h),'Wall thickness leaves no hollow opening.');area=p.width*h-(p.width-2*t)*(h-2*t);break;}
 case 'angle':less(t,Math.min(p.width,p.height),'Thickness must be smaller than both legs.');area=t*(p.width+p.height-t);break;
 case 'channel':less(2*t,p.height,'Two flanges must fit within the outside height.');less(t,p.width,'Web thickness must be smaller than flange width.');area=2*p.width*t+(p.height-2*t)*t;break;
 case 'hollow-profile':less(p.voidArea,p.outerArea,'Void area must be smaller than outside area.');area=p.outerArea-p.voidArea;break;
 case 'disc':area=Math.PI*p.diameter**2/4;length=t;break;
 case 'custom-section':area=p.area;break;
 }
 const volume=area*length/1e9,perPiece=volume*density,total=perPiece*quantity;
 if(![area,volume,perPiece,total].every(v=>Number.isFinite(v)&&v>0))throw new RangeError('Calculation exceeds the supported numeric range.');
 return {area,volume,perPiece,total,pounds:total/0.45359237};
}
export const units={length:{mm:0.001,cm:0.01,m:1,in:0.0254,ft:0.3048},area:{'mm²':1e-6,'cm²':1e-4,'m²':1,'in²':0.00064516,'ft²':0.09290304},volume:{'mm³':1e-9,'cm³':1e-6,'m³':1,'in³':0.000016387064,L:0.001},mass:{kg:1,g:0.001,lb:0.45359237,oz:0.028349523125},density:{'kg/m³':1,'g/cm³':1000,'lb/in³':27679.9047102031}};
units.stress={Pa:1,kPa:1000,MPa:1e6,GPa:1e9,psi:0.45359237*9.80665/0.0254**2,ksi:0.45359237*9.80665/0.0254**2*1000};
export function convert(value,group,from,to){if(!Number.isFinite(value)||!units[group]?.[from]||!units[group]?.[to])throw new RangeError('Invalid conversion.');const result=value*units[group][from]/units[group][to];if(!Number.isFinite(result))throw new RangeError('Conversion overflow.');return result;}
export function expansion(length,alpha,deltaT){positive(length,'Length');positive(alpha,'Expansion coefficient');if(!Number.isFinite(deltaT))throw new RangeError('Temperature change must be finite.');const change=length*alpha*1e-6*deltaT;if(!Number.isFinite(change))throw new RangeError('Expansion overflow.');return change;}
export function resistance(length,area,resistivity){positive(length,'Length');positive(area,'Area');positive(resistivity,'Resistivity');const r=resistivity*length/(area*1e-6);if(!Number.isFinite(r)||r<=0)throw new RangeError('Resistance overflow.');return r;}
export function stockEstimate(stock,cut,kerf,quantity){positive(stock,'Stock length');positive(cut,'Cut length');positive(quantity,'Quantity');if(!Number.isSafeInteger(quantity)||!Number.isFinite(kerf)||kerf<0)throw new RangeError('Use a whole quantity and a nonnegative kerf.');const perStock=Math.floor(stock/(cut+kerf));if(perStock<1)throw new RangeError('Cut plus kerf exceeds stock length.');const stockCount=Math.ceil(quantity/perStock),waste=stockCount*stock-quantity*(cut+kerf);if(!Number.isSafeInteger(perStock)||!Number.isSafeInteger(stockCount)||!Number.isFinite(waste))throw new RangeError('Stock estimate exceeds the supported numeric range.');return {perStock,stockCount,waste};}
export function sheetEstimate(stockLength,stockWidth,partLength,partWidth,kerf,quantity,rotate=false){
 for(const [name,v] of Object.entries({stockLength,stockWidth,partLength,partWidth,quantity}))positive(v,name);
 if(!Number.isSafeInteger(quantity)||!Number.isFinite(kerf)||kerf<0)throw new RangeError('Use a whole quantity and a nonnegative kerf.');
 const normal=Math.floor(stockLength/(partLength+kerf))*Math.floor(stockWidth/(partWidth+kerf));
 const turned=Math.floor(stockLength/(partWidth+kerf))*Math.floor(stockWidth/(partLength+kerf));
 const perSheet=rotate?Math.max(normal,turned):normal;if(!Number.isSafeInteger(perSheet)||perSheet<1)throw new RangeError('Parts do not fit or capacity exceeds the numeric range.');
 const sheetCount=Math.ceil(quantity/perSheet),utilization=quantity*partLength*partWidth/(sheetCount*stockLength*stockWidth)*100;
 if(!Number.isSafeInteger(sheetCount)||!Number.isFinite(utilization)||utilization<=0)throw new RangeError('Sheet estimate exceeds the numeric range.');
 return {perSheet,sheetCount,orientation:rotate&&turned>normal?'Rotated grid':'Normal grid',utilization};
}
export function sectionProperties(shape,input){
 for(const [name,value] of Object.entries(input))positive(value,name);let area,ix,iy;
 if(shape==='rectangle'){const {width:b,height:h}=input;positive(b,'width');positive(h,'height');area=b*h;ix=b*h**3/12;iy=h*b**3/12;}
 else if(shape==='circle'){positive(input.diameter,'diameter');area=Math.PI*input.diameter**2/4;ix=iy=Math.PI*input.diameter**4/64;}
 else if(shape==='round-tube'){const {outerDiameter:d,thickness:t}=input;positive(d,'outerDiameter');positive(t,'thickness');less(2*t,d,'Wall thickness leaves no opening.');const inner=d-2*t;area=Math.PI*(d*d-inner*inner)/4;ix=iy=Math.PI*(d**4-inner**4)/64;}
 else throw new RangeError('Unsupported geometry.');
 if(![area,ix,iy].every(x=>Number.isFinite(x)&&x>0))throw new RangeError('Section calculation exceeds the numeric range.');return {area,ix,iy};
}
