import { lazy, useMemo } from "react";
import { formatEther, formatUnits } from "viem";
import PrimaryBoard from "../../../components/boards/PrimaryBoard";
import { ASSETS, USDC_DECIMAL } from "../../../utils/constants";
import { IUserInfo } from "../../../utils/interfaces";

//  ----------------------------------------------------------------------------------------------

const Position = lazy(() => import('./Position'))

//  ----------------------------------------------------------------------------------------------

interface IProps {
  ethPriceInUsd: number;
  usdcPriceInUsd: number;
  userInfo: IUserInfo;
}

//  ----------------------------------------------------------------------------------------------

export default function BorrowBoard({ userInfo, ethPriceInUsd, usdcPriceInUsd }: IProps) {
  const totalAmountInUsd = useMemo<number>(() => {
    const ethAmountInUsd = Number(formatEther(userInfo.ethBorrowAmount)) * ethPriceInUsd;
    const usdcAmountInUsd = Number(formatUnits(userInfo.usdtBorrowAmount, USDC_DECIMAL)) * usdcPriceInUsd;
    return ethAmountInUsd + usdcAmountInUsd
  }, [userInfo])

  return (
    <PrimaryBoard title="Borrow" action={<span className="text-gray-100">${totalAmountInUsd.toFixed(2)}</span>}>
      <div className="flex flex-col">
        {ASSETS.map(asset => (
          <Position key={asset.id} asset={asset} userInfo={userInfo} ethPriceInUsd={ethPriceInUsd} usdcPriceInUsd={usdcPriceInUsd} />
        ))}
      </div>
    </PrimaryBoard>
  )
}