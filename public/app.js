!(function(){for(var r,a="data-scroll-to",e=document.querySelectorAll("["+a+"]"),i=0,t=e.length;i<t;i++)!(function(){var t,n=e[i];n.addEventListener("click",function(){var e;r||(r=!0,t||(e=n.getAttribute(a),t=document.querySelector("#"+e)),setTimeout(function(){var e=Math.round(t.getBoundingClientRect().top)+window.scrollY;t.addEventListener("blur",function e(){t.removeEventListener("blur",e),t.removeAttribute("tabindex")}),t.tabIndex=0,t.focus({preventScroll:!0}),"scrollBehavior"in document.body.style?scrollTo({top:e,behavior:"smooth"}):scrollTo(0,e),r=!1},90))})})();for(var n="data-event-end-time",o=document.querySelectorAll("["+n+"]"),l=0,c=o.length;l<c;l++){var d=o[l],u=parseInt(d.getAttribute(n));Date.now()>u&&d.classList.add("events__list__inner__event--is-over")}function s(){if(f){f=!1,document.body.classList.remove(p);for(var e=0;e<L.length;e++)L[e].setAttribute("aria-expanded","false");m.focus(),m=void 0}}for(var m,v,_,g,f=!1,p="image-menu-is-open",b=document.querySelector(".image-menu"),h=b.querySelector(".image-menu__close-button"),y=(h.addEventListener("keydown",function(e){f&&"Tab"===e.key&&e.preventDefault()}),b.addEventListener("click",function(e){e=e.target;e!==b&&e!==v||s()}),h.addEventListener("click",s),"data-open-image-menu"),L=[h],E=document.querySelectorAll("["+y+"]"),A=0,S=E.length;A<S;A++)!(function(){var a,i,o=E[A];L.push(o),o.addEventListener("click",function(){var e,t,n;a||(a=o.getAttribute(y),i=o.querySelector(".about__gallery__image__inner__img").alt),e=a,t=i,n="image-menu__inner__image__img--hidden",v||((v=document.createElement("div")).className="image-menu__inner",(_=document.createElement("div")).className="image-menu__inner__image",(g=document.createElement("img")).className="image-menu__inner__image__img",g.onload=function(){_.style.maxWidth=g.naturalWidth,g.classList.remove(n)},_.appendChild(g),v.appendChild(_),b.appendChild(v)),_.style.removeProperty("max-width"),g.classList.add(n),g.src=e,g.alt=t,document.body.classList.add(p);for(var r=0;r<L.length;r++)L[r].setAttribute("aria-expanded","true");v.scrollTop=0,h.focus(),m=o,f=!0})})()})();