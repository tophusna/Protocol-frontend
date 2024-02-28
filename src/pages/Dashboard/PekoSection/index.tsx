import { toast } from "react-toastify";
import { useAccount, useBalance, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useMediaQuery } from "react-responsive";
import { formatUnits } from "viem";
import Table from "../../../components/tableComponents/Table";
import Th from "../../../components/tableComponents/Th";
import Section from "../../../components/Section";
import Tr from "../../../components/tableComponents/Tr";
import Td from "../../../components/tableComponents/Td";
import { IUserInfo } from "../../../utils/interfaces";
import { IN_PROGRESS, PEKO_CONTRACT_ADDRESS, PEKO_DECIMAL, POOL_CONTRACT_ABI, POOL_CONTRACT_ADDRESS } from "../../../utils/constants";
import FilledButton from "../../../components/buttons/FilledButton";

//  ------------------------------------------------------------------------------------------------------

interface IProps {
  userInfo: IUserInfo;
}

//  ------------------------------------------------------------------------------------------------------

export default function PekoSection({ userInfo }: IProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const { address } = useAccount()

  //  --------------------------------------------------------------------

  const { data: pekoBalanceDataOfWallet } = useBalance({
    address,
    token: PEKO_CONTRACT_ADDRESS,
    watch: true
  })

  //  Claim Peko
  const { config: depositConfig } = usePrepareContractWrite({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_CONTRACT_ABI,
    functionName: 'claimPeko',
  })
  const { write: claimPeko, data: claimPekoData } = useContractWrite(depositConfig);
  const { isLoading: claimPekoIsLoading } = useWaitForTransaction({
    hash: claimPekoData?.hash,
    onSuccess: () => {
      toast.success('Peko Claimed.')
    },
    onError: () => {
      toast.error('Claim occured error.')
    }
  })

  //  --------------------------------------------------------------------

  return (
    <Section title="PIL">
      {isMobile ? (
        <div className="flex flex-col text-sm gap-4">
          <div
            className="flex flex-col gap-4 text-gray-100 border-b border-gray-800 rounded-none pb-6"
          >
            {/* Symbol */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Symbol: </span>
              <div className="flex items-center gap-2">
                <img src="/assets/images/logo.png" alt="" className="w-8" />
                <span className="font-semibold uppercase">PIL</span>
              </div>
            </div>

            {/* Unclaimed Peko */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Unclaimed PIL: </span>
              <span>{formatUnits(userInfo.pekoRewardAmount, PEKO_DECIMAL)} PIL</span>
            </div>

            {/* Wallet Balance */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Wallet Balance: </span>
              <span className="text-gray-500">{Number(pekoBalanceDataOfWallet?.formatted).toFixed(2)} PIL</span>
            </div>

            {/* Operation */}
            <div className="flex justify-between w-full">
              <span className="text-gray-500 font-bold">Oepration: </span>
              <FilledButton
                className="w-32"
                disabled={!claimPeko || claimPekoIsLoading}
                onClick={() => claimPeko?.()}
              >
                {claimPekoIsLoading ? IN_PROGRESS : "Claim $PIL"}
              </FilledButton>
            </div>
          </div>
        </div>
      ) : (
        <Table>
          <thead>
            <tr className="bg-gray-900">
              <Th label="Symbol" />
              <Th label="Unclaimed PIL" />
              <Th label="Wallet Balance" />
              <Th label="Operation" />
            </tr>
          </thead>

          <tbody>
            <Tr>
              <Td>
                <div className="flex items-center gap-2">
                  <img src="/assets/images/logo.png" alt="" className="w-8" />
                  <span className="font-semibold uppercase">PIL</span>
                </div>
              </Td>
              <Td className="text-gray-100 font-bold">
                {formatUnits(userInfo.pekoRewardAmount, PEKO_DECIMAL)} PIL
              </Td>
              <Td className="text-gray-100 font-bold">
                {Number(pekoBalanceDataOfWallet?.formatted).toFixed(2)} PIL
              </Td>
              <Td>
                <FilledButton
                  className="w-32"
                  disabled={!claimPeko || claimPekoIsLoading}
                  onClick={() => claimPeko?.()}
                >
                  {claimPekoIsLoading ? IN_PROGRESS : "Claim $PIL"}
                </FilledButton>
              </Td>
            </Tr>
          </tbody>
        </Table>
      )}

    </Section>
  )
}