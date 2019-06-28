let total = 0;
let errors = 0;
let ccPayment = true;
let role = false;
const credit = $('#credit-card');
const paypal = $('#paypal');
const bitcoin = $('#bitcoin');
const payment = $('#payment');
const submitButton = $('form');

const toHide = [$('#other-title'), $('#colors-js-puns'), paypal, bitcoin];

const errorMessages = [$('#nameError'), $('#mailError'), $('#roleError'), $('#activitiesError'),
    $('#cardError'), $('#zipError'), $('#cvvError'), $('#submitError')];

// Hides these elements by default
$.each(toHide, function(){
    this.hide();
});

// Sets the error messages to have the error class.
// This gives them a red text color.
$.each(errorMessages, function(){
    this.addClass("error");
});

// Sets the 'name' input box in focus.
$('#name').focus();


// Shows the "other" input box on choosing "other" from the "Job Role" dropdown.
$('#title').on('change', ()=>{
    if($(event.target).val()==='other'){
        $('#other-title').show();
        role = true;
    } else {
        $('#other-title').hide();
        role = false;
    }
});

// Shows the shirt color dropdown when a design is chosen.
// Shows the appropiate shirt color options based on the chosen design.
$('#design').on('change', ()=>{
    if($(event.target).val()==='js puns'){
        $('#colors-js-puns').show();  
        $('#color option').each(function (i){          
            if(i>2){
                $(this).hide(); 
            } else {
                $(this).show(); 
            }
        });
        $('#color').val('cornflowerblue');
    } else if ($(event.target).val()==='heart js'){
        $('#colors-js-puns').show(); 
        $('#color option').each(function (i){     
            if(i<3){
                $(this).hide(); 
            } else {
                $(this).show(); 
            }
        });
        $('#color').val('tomato');
    } else {
        $('#colors-js-puns').hide();  
    }
});

// Toggles the checkbox and workshop list 
// when a conflicting workshop is chosen.
// Shows and updates the total below the workshop list.
$('.activities').append(`<label id='total-label'>Total: $0.</label>`);
$('.activities :checkbox').change(function(){
    if(this.checked){
        updateTotal(1, this);
        checkConflicts(this, 'line-through', true);
    } else {
        updateTotal(-1, this);
        checkConflicts(this, 'none', false);
    }
});

function updateTotal(sign, element){
    if(element.name === 'all'){
        total += 200 * sign;
    } else {
        total += 100 * sign;
    }
    $('.activities #total-label').remove();
    $('.activities').append(`<label id='total-label'>Total: \$${total}.</label>`);
}

function checkConflicts(element, value, bool){
    const jsFrameworks = $(`input[name='js-frameworks']`);
    const jsLibs = $(`input[name='js-libs']`);
    const express = $(`input[name='express']`);
    const node = $(`input[name='node']`);

    if(element.name === 'js-frameworks'){
        updateConflicts(express, value, bool);
    } else if(element.name === 'express'){ 
        updateConflicts(jsFrameworks, value, bool);    
    } else if(element.name === 'js-libs'){    
        updateConflicts(node, value, bool);  
    } else if(element.name === 'node'){ 
        updateConflicts(jsLibs, value, bool);     
    }
}

function updateConflicts(element, value, bool){
    element.parent().css('text-decoration', value);
    element.prop('disabled', bool);
}

// Disables the "select method" option
// and sets the "credit card" option as the default.
$(`option[value='select_method']`).prop('disabled', true);
payment.val('credit_card');

// Toggles the correct payment div as it is selected.
payment.change(function(){
    if(this.value === 'credit_card'){
        credit.show();
        paypal.hide();
        bitcoin.hide();
        ccPayment = true;
    } else if(this.value === 'paypal'){
        credit.hide(); 
        paypal.show();
        bitcoin.hide(); 
        ccPayment = false;    
    } else {
        credit.hide(); 
        paypal.hide();
        bitcoin.show();
        ccPayment = false; 
    }
});


// Validates the given input field when called
// and shows an error message if improperly formatted.
function validate(input, textElement, regex, message){
    console.log('function called');
    if(!regex.test(input.val())){
        console.log(message);
        showError(textElement, message);
        errors+=1;
    }
}

// Shows an error message when called.
function showError(textElement, message){
    textElement.html(message);
    setTimeout(function(){
        textElement.html('');
    },3000);
}

// Sets event listeners on each of the input fields to be validated.
function setInputListeners(input, textElement, regex, message){
    input.focusout(function(){
        validate(input, textElement, regex, message);
    });
}

// Validates the name field as it loses focus.
setInputListeners($('#name'),$('#nameError'),/.+/,
    `<p>Cannot be blank.</p>`);

// Validates the email field as it loses focus
setInputListeners($('#mail'),$('#mailError'),/^.+@.+\..+$/,
    `<p>Must be a valid email address.</p>`);

// Validates the job role field as it loses focus
setInputListeners($('#other-title'),$('#roleError'),/.+/,
        `<p>Cannot be blank.</p>`);

// Validates the Credit Card field as it loses focus
setInputListeners($('#cc-num'),$('#cardError'),/^\d{13,16}$/, 
        `<p>Credit card number must be 13-16 digits only, no spaces or hyphens.</p>`);

// Validates the Zip Code field as it loses focus
setInputListeners($('#zip'),$('#zipError'),/^\d{5}$/, 
        `<p>Zip code must be 5 digits long.</p>`);

// Validates the CVV field as it loses focus
setInputListeners($('#cvv'),$('#cvvError'),/^\d{3}$/, 
        `<p>CVV must be 3 digits long.</p>`);


// Validates the form submission
submitButton.submit(function(e){
    console.log('submit button pressed');
    errors = 0;
    validate($('#name'),$('#nameError'),/.+/,
    `<p>Cannot be blank.</p>`);
    validate($('#mail'),$('#mailError'),/^.+@.+\..+$/,
    `<p>Must be a valid email address.</p>`);
    if(total == 0){
        showError($('#activitiesError'), `<p>Please choose at least one activity.</p>`);
        errors+=1;
    }
    if(role){
        validate($('#other-title'),$('#roleError'),/.+/,
        `<p>Cannot be blank.</p>`);
    }
    if (ccPayment){
        validate($('#cc-num'),$('#cardError'),/^\d{13,16}$/, 
        `<p>Credit card number must be 13-16 digits only, no spaces or hyphens.</p>`);
        validate($('#zip'),$('#zipError'),/^\d{5}$/, 
        `<p>Zip code must be 5 digits long.</p>`);
        validate($('#cvv'),$('#cvvError'),/^\d{3}$/, 
        `<p>CVV must be 3 digits long.</p>`);

    }
    if (errors > 0){
        e.preventDefault();
        console.log('default prevented. ' + errors + ' errors');
        showError($('#submitError'), `<p>Please fix the ${errors} error${errors>1?'s':''} above.</p>`);
    }
});