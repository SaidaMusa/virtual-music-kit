import java.util.*;

public class RestaurantManager {
    ArrayList<Restaurant> menu = new ArrayList<>();

    public void addFood(Restaurant restaurant) {
        menu.add(restaurant);
    }

    public void showAllMenu() {
        if (menu.isEmpty()) {
            System.out.println("No working day today!");
        } else {
            System.out.println("Menu List: ");
            for (Restaurant menus : menu) {
                System.out.println("**********\n");
                menus.showAllFoodMenu();
                System.out.println("\n**********");
            }
        }
    }


    public void removeByAmount(int total) {
        boolean found = false;
        for (Restaurant menus : menu) {
            if (menus.getTotalAmount() == total) {
                menu.remove(menus);
                System.out.println("Food with this amount :" + total + "was removed!");
                found = true;
                break;
            }
            if (!found) {
                System.out.println("Food with this amount :" + total + "was not found!");
            }
        }
    }




}
