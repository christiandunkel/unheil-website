!(function(){for(var n="data-scroll-to",t=document.querySelectorAll("["+n+"]"),r=0,e=t.length;r<e;r++)!(function(){var e,o=t[r];o.addEventListener("click",function(){var t;o.disabled=!0,e||(t=o.getAttribute(n),e=e||document.querySelector("#"+t)),setTimeout(function(){o.disabled=!1;var t=Math.round(e.getBoundingClientRect().top),t=Math.max(0,t-120+window.scrollY);"scrollBehavior"in document.body.style?scrollTo({top:t,behavior:"smooth"}):scrollTo(0,t),e.addEventListener("blur",function t(){e.removeEventListener("blur",t),e.removeAttribute("tabindex")}),e.tabIndex=0,e.focus()},90)})})()})();