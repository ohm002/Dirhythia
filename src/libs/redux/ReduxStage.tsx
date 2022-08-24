import { Stage as PixiStage } from '@inlet/react-pixi'
import { Context } from 'react'
import { ReactReduxContext } from 'react-redux'

type ContextBridgeProps = {
  children: React.ReactNode
  Context: Context<any>
  render: (children: React.ReactNode) => JSX.Element
}

const ContextBridge: React.FC<ContextBridgeProps> = ({
  children,
  Context,
  render,
}) => {
  return (
    <Context.Consumer>
      {(value) =>
        render(<Context.Provider value={value}>{children}</Context.Provider>)
      }
    </Context.Consumer>
  )
}

type StageProps = PixiStage['props']

const ReduxStage: React.FC<StageProps> = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  )
}
export default ReduxStage
