import { Button, Flex } from 'antd'

function Controls() {
  return (
    <Flex vertical={false} gap="8">
        <Button>
            End
        </Button>
        <Button>
            Mute/ Unmute
        </Button>
        <Button>
            Config
        </Button>
    </Flex>
  )
}

export default Controls