webpackJsonp([9],{223:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var _react=__webpack_require__(6),_react2=_interopRequireDefault(_react),ToggleMenu=_react2.default.createClass({displayName:"ToggleMenu",getInitialState:function(){return{items:[],loaded:!1,firstLoaded:!1}},reload:function(){this.setState({loaded:!1})},getItems:function(){return this.state.items.length<1&&!1===this.state.firstLoaded?_react2.default.createElement("li",{className:"xe-dropdown-header",onClick:this.onClick},"Loading..."):this.state.items.length<1?_react2.default.createElement("li",{className:"xe-dropdown-header",onClick:this.onClick},"항목이 없습니다."):this.state.items.map(function(e,t){var s=$.extend({},e,{identifier:this.props.identifier,align:this.props.align,class:this.props.itemClass,data:this.props.data,reload:this.reload});return _react2.default.createElement(ToggleMenu.Item,_react2.default.__spread({},s,{key:t}))}.bind(this))},getIcon:function(){return this.props.icon?_react2.default.DOM.span({className:this.props.icon}):""},getBody:function(){var e="xe-dropdown-toggle";if(this.props.class){var t=[e];t.push(this.props.class),e=t.join(" ")}var s={className:e,"data-toggle":"xe-dropdown","aria-expanded":"false",onClick:this.onClick};return this.props.html?($.extend(s,{dangerouslySetInnerHTML:{__html:this.props.html}}),_react2.default.DOM.span(s)):_react2.default.DOM.i(s,this.getIcon()," ",this.props.text)},onClick:function(e){e.preventDefault(),!0!==this.state.loaded&&(this.setState({loaded:!0}),$.ajax({url:xeBaseURL+"/plugin/toggleMenu",type:"get",dataType:"json",data:{type:this.props.type,id:this.props.identifier},success:function(e){this.setState({items:e,firstLoaded:!0})}.bind(this)}))},isActive:function(e){return"xe-dropdown "+(!0===this.state.loaded?"open":"")},render:function(){return _react2.default.DOM.span({className:this.isActive(),ref:"dropdown"},this.getBody(),_react2.default.DOM.ul({className:"xe-dropdown-menu"+("right"===this.props.align?" xe-dropdown-menu-right":""),role:"menu"},this.getItems()))}});ToggleMenu.Item=_react2.default.createClass({displayName:"Item",componentWillMount:function(){this.props.script&&!0!==$('script[src="'+this.props.script+'"]').is("script")&&$.getScript(this.props.script)},itemClick:function(e){this.props.reload()},render:function render(){if("raw"==this.props.type)return _react2.default.DOM.li({onClick:this.itemClick,dangerouslySetInnerHTML:{__html:this.props.action}},null);var attr;switch(this.props.type){case"func":attr={href:"#",onClick:function(e){eval(this.props.action)(this.props.data),e.preventDefault()}.bind(this)};break;case"exec":attr={href:"#",onClick:function(e){eval(this.props.action),e.preventDefault()}.bind(this)};break;case"link":attr={href:this.props.action}}return _react2.default.DOM.li({className:this.props.class,onClick:this.itemClick},_react2.default.DOM.a(attr,this.props.text))}}),exports.default=ToggleMenu}},[223]);