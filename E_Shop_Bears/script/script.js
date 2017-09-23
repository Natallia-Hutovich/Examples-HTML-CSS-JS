window.onload = function() {
function render_table(arr,table){
		table.innerHTML='';
		var temp=table.parentNode.querySelector('.card_template');
		arr.forEach(function(item){
			var new_temp=temp.cloneNode(true);
			new_temp.classList.remove('card_template');
			table.appendChild(new_temp);
			new_temp.setAttribute('data-id',item["id"]);
			new_temp.setAttribute('data-size',item["size_category"]);
			var img=new_temp.querySelector('.card_img img');
			img.setAttribute('src','img/'+item['img']);
			var name=new_temp.querySelector('.card_name');
			name.innerText=item['full_name'];
			var size=new_temp.querySelector('.card_size');
			size.innerText=item['size']+'см';
			var price=new_temp.querySelector('.card_price');
			price.innerText=item['price']+' руб.';
		})
		temp=table.querySelectorAll('.card_name');
		var maxHeight=0;
		
		for(var i=0;i<temp.length;i++){
			var height=parseFloat(getComputedStyle(temp[i]).height);
			if(height>maxHeight){
				maxHeight=height;
			}	
		}	
		for(var i=0;i<temp.length;i++){
			temp[i].style.height=maxHeight+'px';
		}	
	}
	 
	
		 
	 function handler_table(e){
		 var target=e.target;
		 var parent;
		 var arr=[];
		 var obj={};
		if (target.tagName=='BUTTON'){
			e.stopPropagation();
			parent=target.closest('div.card');
			obj.id=parent.getAttribute('data-id');
			obj.count=1;
			obj.price=parseFloat(parent.querySelector('.card_price').innerText);
			set_cart(CART,obj);
		}
	}
	 
	 function handler_load(){
		 var arr;
		 var xhr=new XMLHttpRequest();
		 xhr.open('GET',FILE);
		 xhr.onreadystatechange = function() {
			 if ((xhr.readyState===4) && (xhr.status===200)) {
				 console.log(xhr.responseText);
				arr=JSON.parse(xhr.responseText);
				render_table(arr,table);
			}
		}
		 xhr.send();
		// render_table(big_arr,table);
	 }
	 
	
	function filter_category(date,attribute,category){
			
		if (category==='all'){
			for (var i=0;i<date.length;i++){
				date[i].style.display='block';
			}
		}
		else{
			for (var i=0;i<date.length;i++){
				var attr=date[i].getAttribute(attribute);
				if (attr.indexOf(category)>-1){
					date[i].style.display='block';
				}
				else{
					date[i].style.display='none';
					
				}	
			}	
		}
	}
	
	
	function handler_menu_size(e){
		 var target=e.target;
		
		 if (target.tagName=='A'){
			e.preventDefault();
			var size=target.getAttribute('data-size');
			var size1='';
			var size2='';
			filter_category(table.querySelectorAll('.card'),'data-size',size);
			var header=document.getElementById('card_block_header');
			if (size=='all'){
				header.innerText='Медведи все размеры';
			}
			else{
				size1=size.slice(0,size.indexOf('-'));
				size2=size.slice(size.indexOf('-')+1);
				
				if (size1=='0'){
					header.innerText='Медведи до '+size2+'см';
				}
				else if (size2=='300'){
					header.innerText='Медведи выше '+size1+'см';
				}
				else{
					header.innerText='Медведи '+target.getAttribute('data-size')+'см';
				}
			}	
		 }	
	}
	
	function handler_aside(e){
		 var target=e.target;
		 if(target.classList.contains('menu_list')){
			 var panel=target.nextElementSibling;
			 panel.classList.toggle('hidden');
			 target.classList.toggle('menu_list_active');
		 }
			
	}
	
		var FILE='products.json?noCache='+(new Date().getTime());
		//var FILE='products.json';
		var table=document.getElementById('products_card');
		var menu_size=document.getElementById('menu_size');
		var aside=document.querySelector('aside');
		table.addEventListener('click',handler_table);
		menu_size.addEventListener('click',handler_menu_size);
		aside.addEventListener('click',handler_aside);
		handler_load();
		hadler_cart();
  };