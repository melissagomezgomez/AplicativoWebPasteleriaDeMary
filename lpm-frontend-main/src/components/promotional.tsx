export const Promotional: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 px-2 sm:px-0 md:flex-nowrap md:justify-between">
      <div className="flex flex-col gap-8">
        <div className=" text-white">
          <h1 className="text-5xl font-bold md:shrink-0 lg:text-7xl lg:leading-[64px]">
            ¡Deleite <br /> en cada bocado!
          </h1>
          <h3 className="text-3xl">
            Entregando felicidad,{" "}
            <span className="underline underline-offset-4">a tu corazón</span>.
          </h3>
        </div>
      </div>
      <div>
        <img
          className="max-h-96 w-full"
          src="./images/torta.png"
          alt="Torta cereza"
        />
      </div>
    </div>
  );
};
