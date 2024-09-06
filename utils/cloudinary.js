import {Cloudinary} from "@cloudinary/url-gen";

export const uploadImage = () => {

    const cld = new Cloudinary({
        cloud: {
          cloudName: 'dttomxwev'
        }
      });
      const options = {
        upload_preset: 'jjrlv0zw',
        unsigned: true,
    }

return {cld, options}
}

