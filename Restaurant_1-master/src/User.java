public class User {
    private String username;
    private String password;


    public String getUsername() {
        return username;
    }

    User(String password,String username) {
        this.password = password;
        this.username = username;
    }




    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }
}
