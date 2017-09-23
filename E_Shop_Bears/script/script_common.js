var LOCAL_VALUE='bears_card';	
var CART='cart';

	function render_cart(cartId,arr){
		var cart_count=document.getElementById(cartId+'_count');	
		var cart_sum=document.getElementById(cartId+'_sum');	
		var count=0;
		var sum=0;
		arr.forEach(function(item){
			count+=item.count;
			sum+=item.price;
		});
		cart_count.innerText=count;
		cart_sum.innerText=sum;
	}
	
	function get_cart(){
		var arr=[];
		if (localStorage.getItem(LOCAL_VALUE)){
			arr=JSON.parse(localStorage.getItem(LOCAL_VALUE));
		}
		return arr;
	}
	 
	function set_cart(cartId,newElem){
		var arr=get_cart();
		var inArr=false;
		arr.forEach(function(item){
			if(item.id===newElem.id){
				item.count+=newElem.count;
				item.price+=newElem.price;
				inArr=true;
			}	
		});
		if (!inArr){arr.push(newElem);}
		localStorage.setItem(LOCAL_VALUE, JSON.stringify(arr));
		render_cart(cartId,arr);
	} 
	 
	function hadler_cart(){
		var arr=get_cart();
		render_cart(CART,arr);
	}	