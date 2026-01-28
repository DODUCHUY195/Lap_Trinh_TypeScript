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

        <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
        </div>
    </form>
  </div>;
}

export default AuthPage;