import { ThemeProps } from "../../types";
import CN from "classnames";
import styled from "styled-components";
import { useMemo } from "react";
import { dotSubIcon, ethSubIcon } from '../../../assets'

interface Props extends ThemeProps {
  icon : string,
  type : 'evm' | 'substrate'
}


const Component = ({className, icon, type} : Props) => {
  const subIcon = useMemo(()=>{
    return type === 'evm' ? ethSubIcon : dotSubIcon
  }, [type])


  return(
    <div className = {CN(className, '__wallet-logo')}>
      <div dangerouslySetInnerHTML={{__html: icon}} className={'__wallet-logo-main'} />
      <div dangerouslySetInnerHTML={{__html: subIcon}} className={'__wallet-logo-sub'} />
    </div>
  )
}


const LogoWithSubIcon = styled(Component)<Props>(({theme}) => {
  return({
    '&.__wallet-logo': {
      position: 'relative',
      width: 80,
      height: 80,

    },

    '.__wallet-logo-main': {
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: 0
    },

    '.__wallet-logo-sub': {
      position: 'absolute',
      top: '70%',
      left: '60%',
      'svg': {
        transform: 'scale(2)'
      }
    }
  })
})

export default  LogoWithSubIcon
