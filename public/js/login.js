$(document).ready(()=>{
    $('#loginBtn').click(()=>{
        let email = $('#email').val();
        let password = $('#password').val();
        $.post('/login',{email:email,password:password},(res)=>{
            if(res.code == 0){
                alert(res.msg)
            }else{
                alert(res.msg);
                window.location.href = '/home'
            }
        })
    })
})