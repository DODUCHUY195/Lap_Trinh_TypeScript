type BooleanProps = {    
    isRegister: boolean;
};

function AuthPage({ isRegister }: BooleanProps) {
  return <div>

    {isRegister ? "register" : "login"}
    
  </div>;
}

export default AuthPage;