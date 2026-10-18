// Match the reference site's Swiper 4.0.5 setup and max-width breakpoints.
window.initializeIndustries=function(){
 const container=document.querySelector('.m-f8314');
 if(!container||container.dataset.industriesInitialized||typeof Swiper==='undefined')return;
 container.dataset.industriesInitialized='true';
 const slider=new Swiper(container,{slidesPerView:4,loop:true,autoplay:true,breakpoints:{1000:{slidesPerView:3},768:{slidesPerView:2},480:{slidesPerView:1}}});
 // Keep content still while the owner is selecting an element in the editor.
 if(window.parent!==window&&new URLSearchParams(parent.location.search).get('edit')==='1')slider.autoplay.stop();
};
