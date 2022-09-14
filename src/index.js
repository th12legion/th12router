import React from 'react';
import { useCallback, useState } from "react";
import { useStorage, useStorageSubscribe } from "th12storage";

let { Text } = (typeof window !== "undefined" && typeof window.document !== "undefined")
	?{"Text":null}
	:require('react-native');

let setHistory = function(linkPState, linkTitle, path){
	if(linkPState===true && typeof window !== "undefined" && window !== null && typeof window.document !== "undefined" && typeof window.history!="undefined"){
		window.history.pushState(null, linkTitle, path);
		window.document.title = linkTitle;
	}
}

export let Link = function({to, children, className, style, astyle, timer, title, pstate}) {
	let linkPState = (typeof pstate=="undefined")?false:true;
	let linkTitle = title || "";
	let linkClass = className || "";
	let linkStyle = style || {"cursor": "pointer", "textDecoration": "underline"};
	let linkAStyle = astyle || null;
	let linkTimer = timer || 0;
	linkTimer = parseInt(linkTimer);

	let [currentStyle, setCurrentStyle] = useState(linkStyle);

	const handleClick = useCallback(async (path) => {
		let [, setRouterPage] = useStorage("routerPage", "/", true);
		if(linkTimer===0){
			setHistory(linkPState, linkTitle, path);
			setRouterPage(path);
		}else{
			setCurrentStyle(linkAStyle);
			setTimeout(() => {
				setHistory(linkPState, linkTitle, path);
				setCurrentStyle(linkStyle);
				setRouterPage(path);
			}, linkTimer);
		}
    }, [linkTimer]);

	if(Text===null){
		return <div onMouseDown={()=>{handleClick(to)}} className={linkClass} style={currentStyle} rnative="false">{children}</div>;
	}

	return <Text onPress={()=>{handleClick(to)}} className={linkClass} style={currentStyle}  rnative="true">{children}</Text>;
}

let params = {};
let path = "/";
export let Router = function Router({routes}) {
	let [, rst] = useState(0);
	useStorageSubscribe("Router", ["routerPage", "routerAuth"], rst);

	let routesList = routes || [];
	let [routerPage] = useStorage("routerPage", "/");
	let [routerAuth] = useStorage("routerAuth", false);
	
	let component = null;

	params = {};
	path = routerPage;

	for(let i = 0; i<routesList.length; i++){
		if(routesList[i]["path"].trim()===""){
			routesList[i]["path"] = "/";
		}
		let item = routesList[i];
		if(item["private"]!==null && item["private"]!=routerAuth){
			continue;
		}
		if(routesList[i]["path"].indexOf("/:")===-1 && routerPage===routesList[i]["path"]){
			component = <item.component />;
			break;
		}else if(item["path"].indexOf("/:")!==-1){
			let currentStoragePath = routerPage.split("/").filter(item => item!="");
			let waitStoragePath = item["path"].split("/").filter(item => item!="");
			
			if(currentStoragePath.length !== waitStoragePath.length){
				continue;
			}
			let compareStatus = true;
			for(let j = 0; j<waitStoragePath.length; j++){
				if(waitStoragePath[j][0]===":"){
					let key = waitStoragePath[j].substring(1);
					if(key.indexOf("&")!==-1){
						let tmpKey = key.split("&")[0];
						let patternMatch = key.substring(tmpKey.length+1);
						let patternReg = new RegExp(patternMatch, "g");
						let check_status = currentStoragePath[j].match(patternReg);
						if(check_status===null){
							compareStatus = false;
							break;
						}
						key = tmpKey;
					}
					params[key] = currentStoragePath[j];
					continue;
				}else if(waitStoragePath[j] !== currentStoragePath[j]){
					compareStatus = false;
					break;
				}
			}
			
			if(compareStatus===true){
				component = <item.component />;
				break;
			}else{
				params = {};
			}
		}
	}
	
	if(component===null && routesList.length>0){
		let item = routesList[0];
		component = <item.component />;
	}else if(component===null){
		component = <React.Fragment>Not found components!</React.Fragment>;
	}

	return <React.Fragment>{component}</React.Fragment>;
}

export let useParams = function() {
	return params;
}

export let usePath = function() {
	return path;
}