function changepin(){
if(frm.pin.value == "")
{
	alert("Enter the Password.");
	frm.pin.focus(); 
	return false;
}
if((frm.pin.value).length < 8)
{
	alert("Password should be minimum 8 characters.");
	frm.pin.focus();
	return false;
}

if(frm.confirmpin.value == "")
{
	alert("Enter the Confirmation Password.");
	return false;
}
if(frm.confirmpin.value != frm.pin.value)
{
	alert("Password confirmation does not match.");
	return false;
}

return true;
}