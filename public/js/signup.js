$(document).ready(() => {
    $('#signupBtn').click(() => {
        let email = $('#email').val();
        let name = $('#name').val();
        let password = $('#password').val();
        let confirmPassword = $('#confirmPassword').val();

        if (password.length < 6) {
            alert('password should be more than 6 characters')
        } else {
            if (password !== confirmPassword) {
                alert("passwords don't match")
            } else {
                $.post('/signup', { email: email, name: name, password: password }, (res) => {
                  if(res.code == 1){
                      alert(res.msg);
                      window.location.href = "/home"
                  }else{
                      alert(res.msg);

                  }

                })
            }
        }


    })
})