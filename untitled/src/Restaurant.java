public class Restaurant {
   private String country;
   private String nameOfFood;
   private int portion;
   private int discount;
   private int totalAmount;

    public Restaurant(String country, String nameOfFood, int portion, int discount, int totalAmount) {
        this.country = country;
        this.nameOfFood = nameOfFood;
        this.portion = portion;
        this.discount = discount;
        this.totalAmount = totalAmount;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getNameOfFood() {
        return nameOfFood;
    }

    public void setNameOfFood(String nameOfFood) {
        this.nameOfFood = nameOfFood;
    }

    public int getPortion() {
        return portion;
    }

    public void setPortion(int portion) {
        this.portion = portion;
    }

    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public int getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void showAllFoodMenu(){
        System.out.printf("Country:%s\nFood:%s\nPortion:%s\nDiscount:%s\nTotal:%s\n sum",country,nameOfFood,portion,discount,totalAmount);
    }
}
