type BooleanProps = {    
    isRegister: boolean;
};

function AuthPage({ isRegister }: BooleanProps) {
  return <div>{isRegister ? "Register Page" : "Login Page"}</div>;
}

export default AuthPage;