'use client'

import { Modal, Text } from '@mantine/core'
import Image from 'next/image'
import classes from './CrossModalLoader.module.css'

type CrossModalLoaderProps = {
  opened: boolean
  message?: string
}

export function CrossModalLoader({
  opened,
  message = 'Procesando cruce...'
}: CrossModalLoaderProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      size='auto'
      radius={14}
      classNames={{
        overlay: classes.overlay,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.shell}>
        <Image
          src='/assets/branding/cross-modal-loader.svg'
          alt=''
          width={56}
          height={56}
          className={classes.spinner}
          aria-hidden='true'
        />

        <Text className={classes.message}>{message}</Text>
      </div>
    </Modal>
  )
}
