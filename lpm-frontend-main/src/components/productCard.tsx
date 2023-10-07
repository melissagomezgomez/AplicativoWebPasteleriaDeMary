import React from "react";

export type ProductCardProps = {
  productImg: string;
  badgeTitle?: string;
  title: string;
  description: string;
  price: number;
  badgeBgColor?: string;
  productId?: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  productImg,
  badgeTitle,
  title,
  description,
  price,
  badgeBgColor,
  productId,
}) => {
  return (
    <div className="h-full p-2">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 p-2 pt-0 shadow-md md:pt-8 lg:pt-2">
        <div className="flex flex-row items-center justify-center md:flex-col lg:flex-row">
          <span
            className="bg-primary absolute top-0 right-0 z-10 rounded-bl-2xl py-0.5 px-3 font-bold uppercase text-white"
            style={{ backgroundColor: badgeBgColor }}
          >
            {badgeTitle}
          </span>
          <div className="shrink-0">
            <img
              className="h-36 w-36 rounded-full object-cover"
              src={productImg}
              alt={title}
            />
          </div>
          <div className="h-full flex-auto px-2 pt-8">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm">{description}</p>
            <span className="text-lg font-bold text-gray-800">${price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
