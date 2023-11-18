/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
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
  PromiseOrValue,
} from "../../../common";

export interface ISuUniV3OracleInterface extends utils.Interface {
  functions: {
    "assetToPool(address)": FunctionFragment;
    "enableAssetPool(address,uint24)": FunctionFragment;
    "getFiatPrice1e18(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "assetToPool"
      | "enableAssetPool"
      | "getFiatPrice1e18"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "assetToPool",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "enableAssetPool",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getFiatPrice1e18",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "assetToPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enableAssetPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFiatPrice1e18",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ISuUniV3Oracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISuUniV3OracleInterface;

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
    assetToPool(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    enableAssetPool(
      _asset: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  assetToPool(
    asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  enableAssetPool(
    _asset: PromiseOrValue<string>,
    _fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getFiatPrice1e18(
    asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    assetToPool(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    enableAssetPool(
      _asset: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    assetToPool(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    enableAssetPool(
      _asset: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    assetToPool(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    enableAssetPool(
      _asset: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
