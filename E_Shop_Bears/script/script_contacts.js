
function handler_submit(e){
	var checked=true;
	var fields=e.target.querySelectorAll('input, textarea');
	for(var i=0;i<fields.length;i++){
		fields[i].classList.remove('wrong');
		if (fields[i].value==''){
			fields[i].classList.add('wrong');
			checked=false;
		}
	}
	if (!checked){
		e.preventDefault();
	}
}

window.onload = function() {
	var form=document.forms['contacts_form'];
	form.addEventListener('submit',handler_submit);
	hadler_cart();
  };