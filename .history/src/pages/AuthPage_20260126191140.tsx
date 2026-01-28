type BooleanProps = {    
    isRegister: boolean;
};

function AuthPage({ isRegister }: BooleanProps) {
  return <div>

    {isRegister ? "register" : "login"}
    <form action="">
        <div>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
        </div>
    </form>
  </div>;
}

export default AuthPage;