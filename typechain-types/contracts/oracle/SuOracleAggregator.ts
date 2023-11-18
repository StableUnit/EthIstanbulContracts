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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface SuOracleAggregatorInterface extends utils.Interface {
  functions: {
    "ACCESS_CONTROL_SINGLETON()": FunctionFragment;
    "ADMIN_ROLE()": FunctionFragment;
    "ALERTER_ROLE()": FunctionFragment;
    "DAO_ROLE()": FunctionFragment;
    "LIQUIDATION_ACCESS_ROLE()": FunctionFragment;
    "MINT_ACCESS_ROLE()": FunctionFragment;
    "REWARD_ACCESS_ROLE()": FunctionFragment;
    "VAULT_ACCESS_ROLE()": FunctionFragment;
    "assetToOracle(address)": FunctionFragment;
    "getFiatPrice1e18(address)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "oracleImplementations(uint256)": FunctionFragment;
    "setOracleIdForAssets(address[],uint256)": FunctionFragment;
    "setOracleImplementation(uint256,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ACCESS_CONTROL_SINGLETON"
      | "ADMIN_ROLE"
      | "ALERTER_ROLE"
      | "DAO_ROLE"
      | "LIQUIDATION_ACCESS_ROLE"
      | "MINT_ACCESS_ROLE"
      | "REWARD_ACCESS_ROLE"
      | "VAULT_ACCESS_ROLE"
      | "assetToOracle"
      | "getFiatPrice1e18"
      | "initialize"
      | "oracleImplementations"
      | "setOracleIdForAssets"
      | "setOracleImplementation"
      | "supportsInterface"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ACCESS_CONTROL_SINGLETON",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ALERTER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "DAO_ROLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MINT_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "REWARD_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "VAULT_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "assetToOracle",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getFiatPrice1e18",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "oracleImplementations",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleIdForAssets",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleImplementation",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(
    functionFragment: "ACCESS_CONTROL_SINGLETON",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ALERTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "DAO_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MINT_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "REWARD_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "VAULT_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetToOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFiatPrice1e18",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oracleImplementations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleIdForAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface SuOracleAggregator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SuOracleAggregatorInterface;

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
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<[string]>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DAO_ROLE(overrides?: CallOverrides): Promise<[string]>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    assetToOracle(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      _authControl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    oracleImplementations(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setOracleIdForAssets(
      assets: PromiseOrValue<string>[],
      oracleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOracleImplementation(
      oracleId: PromiseOrValue<BigNumberish>,
      oracleImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<string>;

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  ALERTER_ROLE(overrides?: CallOverrides): Promise<string>;

  DAO_ROLE(overrides?: CallOverrides): Promise<string>;

  LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  assetToOracle(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getFiatPrice1e18(
    asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    _authControl: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  oracleImplementations(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setOracleIdForAssets(
    assets: PromiseOrValue<string>[],
    oracleId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOracleImplementation(
    oracleId: PromiseOrValue<BigNumberish>,
    oracleImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<string>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<string>;

    DAO_ROLE(overrides?: CallOverrides): Promise<string>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    assetToOracle(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _authControl: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    oracleImplementations(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setOracleIdForAssets(
      assets: PromiseOrValue<string>[],
      oracleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracleImplementation(
      oracleId: PromiseOrValue<BigNumberish>,
      oracleImplementation: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<BigNumber>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DAO_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    assetToOracle(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _authControl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    oracleImplementations(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOracleIdForAssets(
      assets: PromiseOrValue<string>[],
      oracleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOracleImplementation(
      oracleId: PromiseOrValue<BigNumberish>,
      oracleImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ACCESS_CONTROL_SINGLETON(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DAO_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    LIQUIDATION_ACCESS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REWARD_ACCESS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    assetToOracle(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFiatPrice1e18(
      asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _authControl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    oracleImplementations(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setOracleIdForAssets(
      assets: PromiseOrValue<string>[],
      oracleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOracleImplementation(
      oracleId: PromiseOrValue<BigNumberish>,
      oracleImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
