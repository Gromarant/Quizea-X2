//Agregar mensaje de error (add error message)
const setErrorMessage = (errorMessage) =>
Swal.fire({
  icon: 'error',
  title: 'Error',
  text: errorMessage,
  footer: '<a href="">Why do I have this issue?</a>'
})

//validations patterns
const nameValidation = /^[a-zA-Z]{2,20}$/;
const emailValidation = /^\w+([*@\/hotmail\/gmail([\.-]?\w+)*(\.\w{2,4})$/;

//Validation Functions
const checkEmail = (contactEmail) => emailValidation.test(contactEmail);
const checkPassword = (contactName) => nameValidation.test(contactName);

//limpiar los valores de los inputs
const cleanInputsValue = (e) => {
  e.target.email.value = '';
  e.target.password.value = '';
}

//Obtener datos de contacto (get contact data)
const handleSubmit = (e) => {
  e.preventDefault();
  let email = e.target.email.value;
  let password = e.target.password.value;
  
  //Validación del formulario (validation form)
  let errorMessage = '';
  let validated = true;
  
  if(!checkPassword(password)) {
    validated = false;
    errorMessage += '* Password: Error on password';
    cleanInputsValue(e);
  } 
  
  if (!checkPassword) {
    errorMessage  += '* Nombre: debe tener al menos 2 caracteres, no contener números, caracteres especiales o espacios y tener un máximo de 20 caracteres';
    cleanInputsValue(e);
  }
  else if (!checkEmail) {
    errorMessage += '* Email: no admite caracteres especiales';
    cleanInputsValue(e);
  }

  if (validated) {
    createContact({password, email});
    cleanInputsValue(e);
  } 
  else {
    setErrorMessage(errorMessage);
  }
}