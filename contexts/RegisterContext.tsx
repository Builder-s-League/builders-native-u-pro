import React, { createContext, ReactNode, useContext, useState } from "react";

type Player = {
  name: string;
  birthDate: string;
  gender: string;
  ageGroup: string;
  experience: string;
  level: string;
  club: string;
  dominantFoot: string;
};

type RegisterData = {
  userType: string;
  players: Player[];
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type RegisterContextType = {
  data: RegisterData;
  setUserType: (type: string) => void;
  addPlayer: (player: Player) => void;
  setAccountInfo: (info: Partial<RegisterData>) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<RegisterData>({
    userType: "",
    players: [],
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const setUserType = (type: string) => {
    setData((prev) => ({ ...prev, userType: type }));
  };

  const addPlayer = (player: Player) => {
    setData((prev) => ({ ...prev, players: [...prev.players, player] }));
  };

  const setAccountInfo = (info: Partial<RegisterData>) => {
    setData((prev) => ({ ...prev, ...info }));
  };

  return (
    <RegisterContext.Provider
      value={{ data, setUserType, addPlayer, setAccountInfo }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context)
    throw new Error("useRegister must be used within RegisterProvider");
  return context;
};
