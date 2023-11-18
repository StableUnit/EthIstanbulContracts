/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export interface IChronicleInterface extends utils.Interface {
  functions: {
    "read()": FunctionFragment;
    "readWithAge()": FunctionFragment;
    "tryRead()": FunctionFragment;
    "tryReadWithAge()": FunctionFragment;
    "wat()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "read"
      | "readWithAge"
      | "tryRead"
      | "tryReadWithAge"
      | "wat"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "read", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "readWithAge",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "tryRead", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tryReadWithAge",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "wat", values?: undefined): string;

  decodeFunctionResult(functionFragment: "read", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "readWithAge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tryRead", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tryReadWithAge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wat", data: BytesLike): Result;

  events: {};
}

export interface IChronicle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IChronicleInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    read(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { value: BigNumber }>;

    readWithAge(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { value: BigNumber; age: BigNumber }>;

    tryRead(
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { isValid: boolean; value: BigNumber }>;

    tryReadWithAge(
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        isValid: boolean;
        value: BigNumber;
        age: BigNumber;
      }
    >;

    wat(overrides?: CallOverrides): Promise<[string] & { wat: string }>;
  };

  read(overrides?: CallOverrides): Promise<BigNumber>;

  readWithAge(
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { value: BigNumber; age: BigNumber }>;

  tryRead(
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber] & { isValid: boolean; value: BigNumber }>;

  tryReadWithAge(
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, BigNumber] & {
      isValid: boolean;
      value: BigNumber;
      age: BigNumber;
    }
  >;

  wat(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    read(overrides?: CallOverrides): Promise<BigNumber>;

    readWithAge(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { value: BigNumber; age: BigNumber }>;

    tryRead(
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { isValid: boolean; value: BigNumber }>;

    tryReadWithAge(
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        isValid: boolean;
        value: BigNumber;
        age: BigNumber;
      }
    >;

    wat(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    read(overrides?: CallOverrides): Promise<BigNumber>;

    readWithAge(overrides?: CallOverrides): Promise<BigNumber>;

    tryRead(overrides?: CallOverrides): Promise<BigNumber>;

    tryReadWithAge(overrides?: CallOverrides): Promise<BigNumber>;

    wat(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    read(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    readWithAge(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tryRead(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tryReadWithAge(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wat(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
