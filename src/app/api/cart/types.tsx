
// for utils.tsx

export type Cart = {
  products: Array<{
    id: number,
    price: number,
    quantity: number,
    discountPercentage: number,
  }>;
  userId: number;
}


// for routes.tsx


export type cartProduct = {
  productId: number;
  price: number;
  quantity: number;
  discount: number;
}

export type dataBaseProduct = {
  id: number;
  title: string;
  rating: number;
  stock: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  }
}

export type enhanceCartProduct = {
  id: number;
  price: number;
  quantity: number;
  discount: number;
  title: string;
  rating: number;
  stock: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  }
  realStock: number;
}

export type PickUpInfo = {
  name: string;
  phone: string;
  address: string;
  commune: string;
};

export type CustomerData = {
  name: string;
  shipping_street: string;
  commune: string;
  phone: string;
}
