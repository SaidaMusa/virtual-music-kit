import java.util.HashMap;
import java.util.Map;

public class UserManager {
    private Map<String, User> users = new HashMap<>();

    public boolean register(String username, String password) {
        if (users.containsKey(username)) {
            System.out.println("User already exists!");
            return false;
        }
       users.put(username, new User(username,password));
        System.out.println("Registrated successfully!");
        return true;
    }

    public boolean login(String username,String password){
        if (users.containsKey(username) && users.get(username).checkPassword(password)) {
            System.out.println("Login successful!");
            return true;
        }
        System.out.println("Invalid username or password!");
        return true;
    }

}




