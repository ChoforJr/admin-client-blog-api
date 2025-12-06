import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;
console.log(apiUrl);

export function useAppLogic() {
  const { name } = useParams();
  const [items, setItems] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products", {
          mode: "cors",
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.map((item) => {
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            orders: item.orders ? item.orders : 0,
          };
        });

        setItems(neededItems);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (!items) return;

    setTotalOrders(() => {
      const sum = items.reduce((total, item) => {
        return total + item.orders;
      }, 0);
      return sum;
    });

    setTotalPrice(() => {
      const price = Number(
        items
          .reduce((total, item) => {
            const product = item.price * item.orders;
            return total + product;
          }, 0)
          .toFixed(2)
      );
      return price;
    });
  }, [items]);

  function increaseOrDecrease(id, change) {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        let newOrders;
        if (item.id == id) {
          if (change == "+") {
            newOrders = item.orders + 1;
          } else if (change == "-") {
            newOrders = item.orders - 1;
          } else {
            newOrders = 0;
          }
          return {
            ...item,
            orders: newOrders,
          };
        }
        return item;
      });
      return updatedItems;
    });
  }

  function increaseOrders(id) {
    const firstChar = parseInt(id, 10);
    increaseOrDecrease(firstChar, "+");
  }

  function decreaseOrders(id) {
    const firstChar = parseInt(id, 10);
    increaseOrDecrease(firstChar, "-");
  }

  function onChangeInput(event, id) {
    const { value } = event.target;
    const firstChar = parseInt(id, 10);

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id == firstChar) {
          return {
            ...item,
            orders: Number(value),
          };
        }
        return item;
      });
      return updatedItems;
    });
  }

  function removeOrders(id) {
    const firstChar = parseInt(id, 10);
    increaseOrDecrease(firstChar, "R");
  }

  function clearOrders() {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        return {
          ...item,
          orders: 0,
        };
      });
      return updatedItems;
    });
  }
  return {
    name,
    items,
    totalOrders,
    totalPrice,
    increaseOrders,
    decreaseOrders,
    onChangeInput,
    removeOrders,
    clearOrders,
  };
}
