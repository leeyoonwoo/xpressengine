webpackJsonp([8],{222:function(t,e,o){"use strict";var n=o(7),s=function(t){return t&&t.__esModule?t:{default:t}}(n);$("#btnCreateCategory").on("click",function(t){var e=t.target,o=$(e).closest("form").find('[name="id"]').val(),n={};if(!o)return void s.default.form($(e),"You must first create a category ID.");s.default.form.fn.clear($(e).closest("form")),n.categoryName=o,XE.ajax({type:"post",dataType:"json",data:n,url:storeCategoryInfo.url,success:function(t){var o=$(e).closest(".__xe_df_category");o.find('[name="categoryId"]').val(t.id),o.find("button").hide(),o.append($("<a>").text(storeCategoryInfo.text).prop("target","_blank").prop("href","/settings/category/"+t.id))}})})},7:function(t,e,o){"use strict";var n,s,a;"function"==typeof Symbol&&Symbol.iterator;!function(o,i){s=[e],n=i,void 0!==(a="function"==typeof n?n.apply(e,s):n)&&(t.exports=a)}(0,function(t){var e=jQuery=window.jQuery;DynamicLoadManager.cssLoad("/assets/core/common/css/griper.css"),t.options={toastContainer:{template:'<div class="__xe_toast_container xe-toast-container"></div>',boxTemplate:'<div class="toast_box"></div>'},toast:{classSet:{danger:"xe-danger",positive:"xe-positive",warning:"xe-warning",success:"xe-success",fail:"xe-fail",error:"xe-danger",info:"xe-positive"},expireTimes:{"xe-danger":0,"xe-positive":5,"xe-warning":10,"xe-success":2,"xe-fail":5},status:{500:"xe-danger",401:"xe-warning"},template:'<div class="alert-dismissable xe-alert" style="display:none;"><button type="button" class="__xe_close xe-btn-alert-close" aria-label="Close"><i class="xi-close"></i></button><span class="message"></span></div>'},form:{selectors:{elementGroup:".form-group",errorText:".__xe_error_text"},classes:{message:["error-text","__xe_error_text"]},tags:{message:"p"}}},t.toast=function(t,e,o){var n="";n=-1!=navigator.userAgent.toLowerCase().indexOf("mobile")?o&&-1!=o.indexOf("top")?"top":"bottom":o||"bottom",this.toast.fn.add(t,e,n)};var o=null,n={};t.toast.fn=t.toast.prototype={constructor:t.toast,options:t.options.toast,statusToType:function(t){var e=this.options.status[t];return void 0===e?"xe-danger":e},add:function(e,o,n){return t.toast.fn.create(e,o,n),this},create:function(o,n,s){var a=0,o=this.options.classSet[o]||"xe-danger";0!=this.options.expireTimes[o]&&(a=parseInt((new Date).getTime()/1e3)+this.options.expireTimes[o]);var i=e(this.options.template);i.attr("data-expire-time",a).addClass(o).find(".message").remove(),i.append(n),s&&-1!=s.indexOf("top")?t.toast.fn.container(s).prepend(i):t.toast.fn.container(s).append(i),this.show(i)},show:function(t){t.slideDown("slow")},destroy:function(t){t.slideUp("slow",function(){t.remove()})},container:function(s){if(n.hasOwnProperty(s))return n[s];var a={};switch(s||(s="bottom"),s){case"top":e.extend(a,{top:0,bottom:"initial",margin:"0 auto"});break;case"topLeft":e.extend(a,{margin:0,top:0,left:0,right:"initial",bottom:"initial",minWidth:"50%"});break;case"topRight":e.extend(a,{margin:0,top:0,right:0,left:"initial",bottom:"initial",minWidth:"50%"});break;case"bottom":e.extend(a,{bottom:0,left:0,right:0,top:"initial",margin:"0 auto"});break;case"bottomLeft":e.extend(a,{margin:0,bottom:0,left:0,right:"initial",top:"initial",minWidth:"50%"});break;case"bottomRight":e.extend(a,{margin:0,bottom:0,left:"initial",right:0,top:"initial",minWidth:"50%"})}o=e(t.options.toastContainer.boxTemplate);var i=e(t.options.toastContainer.template).append(o).css(a);n[s]=o,e("body").append(i),i.on("click","button.__xe_close",function(o){t.toast.fn.destroy(e(this).parents(".xe-alert")),o.preventDefault()});return function(o){var n;return function(){n=setInterval(function(){var n=parseInt((new Date).getTime()/1e3);o.find("div.xe-alert").each(function(){var o=parseInt(e(this).data("expire-time"));0!=o&&n>o&&t.toast.fn.destroy(e(this))})},1e3)}}(o)(),o}},t.form=function(e,o){t.form.fn.putByElement(e,o)},t.form.fn=t.form.prototype={constructor:t.form,options:t.options.form,getGroup:function(t){return t.closest(this.options.selectors.elementGroup)},putByElement:function(t,e){this.put(this.getGroup(t),e,t)},put:function(t,o,n){1==t.length?t.append(e("<"+this.options.tags.message+">").addClass(this.options.classes.message.join(" ")).text(o)):0==t.length&&n.after(e("<"+this.options.tags.message+">").addClass(this.options.classes.message.join(" ")).text(o))},clear:function(t){t.find(this.options.tags.message+this.options.selectors.errorText).remove()}}})}},[222]);