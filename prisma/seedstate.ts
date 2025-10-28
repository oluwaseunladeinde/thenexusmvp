// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const nigerianStates = [
    {
        name: 'Lagos',
        code: 'LA',
        region: 'South West',
        cities: ['Lagos', 'Ikeja', 'Victoria Island', 'Lekki', 'Surulere'],
        lgas: ['Alimosho', 'Eti-Osa', 'Kosofe', 'Oshodi-Isolo', 'Ikeja', 'Ikorodu', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Oshodi', 'Oshodi Isolo', 'Shomolu', 'Surulere', 'Victoria Island', 'Yaba', 'Ogba', 'Lagos Island', 'Lagos Mainland']
    },
    {
        name: 'Abuja (FCT)',
        code: 'FC',
        region: 'North Central',
        cities: ['Abuja', 'Garki', 'Wuse', 'Maitama', 'Asokoro'],
        lgas: ['Garki', 'Wuse', 'Maitama', 'Kubwa', 'Asokoro', 'Bwari', 'Kuje', 'Kwali', 'Manga', 'Municipal', 'Gwagwalada', 'Kuje', 'Kwali', 'Manga', 'Municipal', 'Gwagwalada']
    },
    {
        name: 'Oyo',
        code: 'OY',
        region: 'South West',
        cities: ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin'],
        lgas: ['Ibadan North', 'Ogbomosho North', 'Ogbomosho South', 'Iseyin', 'Oyo East', 'Oyo West']
    },
    {
        name: 'Delta',
        code: 'DE', region: 'South South',
        cities: ['Warri', 'Asaba', 'Sapele', 'Ughelli'],
        lgas: ['Aniocha North', 'Aniocha South', 'Bomadi', 'Etche', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele']
    },
    {
        name: 'Edo',
        code: 'ED',
        region: 'South South',
        cities: ['Benin City', 'Auchi', 'Ekpoma', 'Uromi'],
        lgas: ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde']
    },
    {
        name: 'Kaduna',
        code: 'KD',
        region: 'North West',
        cities: ['Kaduna', 'Zaria', 'Kafanchan', 'Sabon Gari'],
        lgas: ['Goronyo', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kaita', 'Kajuru', 'Kaura', 'Kaura Namoda', 'Kaura Namoda', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Shanga', 'Zaria']
    },
    {
        name: 'Kano',
        code: 'KN',
        region: 'North West',
        cities: ['Kano', 'Fagge', 'Dala', 'Gwale'],
        lgas: ['Nasarawa', 'Dala', 'Tarauni', 'Gwale', 'Dawakin Kudu', 'Dawakin Tofa', 'Kumbi', 'Gujba', 'Kano Municipal', 'Kibiya', 'Kaita', 'Kajuru', 'Kaura', 'Kaura Namoda', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Shanga', 'Zaria']
    },
    {
        name: 'Ogun',
        code: 'OG',
        region: 'South West',
        cities: ['Abeokuta', 'Sagamu', 'Ijebu Ode', 'Ota'],
        lgas: ['Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ijebu Ode South', 'Ijebu West', 'Odeda', 'Odogun', 'Ogun Waterside', 'Remo North', 'Sagamu', 'Yewa North', 'Yewa South']
    },
    {
        name: 'Cross River',
        code: 'CR',
        region: 'South South',
        cities: ['Calabar', 'Ugep', 'Ikom', 'Ogoja'],
        lgas: ['Bakassi', 'Calabar', 'Etung', 'Ikom', 'Obanliku', 'Obudu', 'Odukpani', 'Ogoja', 'Yala']
    },
    {
        name: 'Rivers',
        code: 'RI',
        region: 'South South',
        cities: ['Port Harcourt', 'Bonny', 'Obio-Akpor', 'Opobo', 'Degema', 'Okrika', 'Ahoada', 'Omoku', 'Eleme', 'Bori'],
        lgas: ['Abua-Odual', 'Ahodad East', 'Ahoada West', 'Akuku Toru', 'Andoni', 'Asara-Toru', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Iwerre', 'Khana', 'Obio-Akpor', 'Ogba', 'Okrika', 'Omuma', 'Orhionmwon', 'Oru East', 'Oru West', 'Oyigbo', 'Port-Harcourt', 'Ukwa', 'Ukwuani', 'Umuahia', 'Umu-Nneochi']
    },
    {
        name: 'Akwa Ibom', code: 'AK',
        region: 'South South',
        cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron'],
        lgas: ['Abak', 'Eastern Obolo', 'Eket', 'Ikom', 'Obakpa', 'Ogbia', 'Okpokwu', 'Onna', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu-Nneochi']
    },
    {
        name: 'Anambra', code: 'AN',
        region: 'South East',
        cities: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia'],
        lgas: ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ekwulobia', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka']
    },
    {
        name: 'Imo',
        code: 'IM',
        region: 'South East',
        cities: ['Owerri', 'Orlu', 'Okigwe', 'Mbaise'],
        lgas: ['Aboh-Mbaise', 'Ahiazu-Mbaise', 'Ehime-Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte', 'Ikeduru', 'Isiala-Mbano', 'Mbaitoli', 'Ngor-Okpala', 'Njaba', 'Nkwerre', 'Nwangele']
    },
    {
        name: 'Enugu',
        code: 'EN',
        region: 'South East',
        cities: ['Enugu', 'Nsukka', 'Oji River', 'Awgu'],
        lgas: ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo-Etiti', 'Igbo-Eze North', 'Igbo-Eze South', 'Isi-Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka']
    },
    {
        name: 'Abia',
        code: 'AB',
        region: 'South East',
        cities: ['Umuahia', 'Aba', 'Arochukwu', 'Ohafia'],
        lgas: ['Aba North', 'Aba South', 'Arochukwu', 'Ikwuano', 'Isiala Mbano', 'Obi', 'Ohafia', 'Ohafia', 'Ukwa', 'Umuahia', 'Umuahia North', 'Umuahia South']
    },
    {
        name: 'Plateau',
        code: 'PL',
        region: 'North Central',
        cities: ['Jos', 'Bukuru', 'Shendam', 'Pankshin'],
        lgas: ['Bokkos', 'Barkin Ladi', 'Bassa', 'Jos East', 'Jos North', 'Jos South', 'Mangu', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam']
    },
    {
        name: 'Kwara', code: 'KW',
        region: 'North Central',
        cities: ['Ilorin', 'Offa', 'Omu-Aran', 'Lafiagi'],
        lgas: ['Adavi', 'Daura', 'Gwale', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Kaiama', 'Moro', 'Offa', 'Oke-Ero', 'Oyun', 'Pategi']
    },
    {
        name: 'Benue',
        code: 'BE',
        region: 'North Central',
        cities: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala'],
        lgas: ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka']
    },
    {
        name: 'Niger',
        code: 'NI',
        region: 'North Central',
        cities: ['Minna', 'Bida', 'Kontagora', 'Suleja'],
        lgas: ['Agwara', 'Bida', 'Dala', 'Goronyo', 'Kontagora', 'Lapai', 'Mai\'adua', 'Migori', 'Rimi', 'Rimi', 'Tudun Wada', 'Ussa', 'Wushishi']
    },
    {
        name: 'Nasarawa',
        code: 'NA',
        region: 'North Central',
        cities: ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa'],
        lgas: ['Akwanga', 'Awe', 'Doma', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba']
    },
    {
        name: 'Adamawa',
        code: 'AD',
        region: 'North East',
        cities: ['Yola', 'Mubi', 'Jimeta'],
        lgas: ['Yola North', 'Yola South', 'Mubi North', 'Mubi South', 'Hong', 'Madagali', 'Michika', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Maiha']
    },
    {
        name: 'Bauchi',
        code: 'BA',
        region: 'North East',
        cities: ['Bauchi', 'Azare', 'Misau'],
        lgas: ['Bauchi', 'Toro', 'Dass', 'Alkaleri', 'Kirfi', 'Misau', 'Warji', 'Ganjuwa', 'Shira', 'Zaki', 'Katagum', 'Gamawa', 'Itas/Gadau', 'Ningi', 'Bogoro', 'Damban', 'Darazo', 'Giade', 'Jama\'are', 'Tafawa Balewa']
    },
    {
        name: 'Bayelsa',
        code: 'BY',
        region: 'South South',
        cities: ['Yenagoa', 'Brass', 'Ogbia'],
        lgas: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa']
    },
    {
        name: 'Borno',
        code: 'BO',
        region: 'North East',
        cities: ['Maiduguri', 'Bama', 'Biu'],
        lgas: ['Maiduguri', 'Jere', 'Bama', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiha', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani']
    },
    {
        name: 'Ebonyi',
        code: 'EB',
        region: 'South East',
        cities: ['Abakaliki', 'Afikpo', 'Onueke'],
        lgas: ['Abakaliki', 'Ebonyi', 'Izzi', 'Ikwo', 'Ezza North', 'Ezza South', 'Ohaukwu', 'Onicha', 'Ivo', 'Ohaozara', 'Ishielu', 'Afikpo North', 'Afikpo South']
    },
    {
        name: 'Ekiti',
        code: 'EK',
        region: 'South West',
        cities: ['Ado-Ekiti', 'Ikere-Ekiti', 'Efon-Alaaye'],
        lgas: ['Ado-Ekiti', 'Ekiti East', 'Ekiti West', 'Ekiti South-West', 'Ikere', 'Irepodun/Ifelodun', 'Ijero', 'Ido/Osi', 'Oye', 'Ikole', 'Moba', 'Gbonyin', 'Emure', 'Ise/Orun', 'Ilejemeje']
    },
    {
        name: 'Gombe',
        code: 'GO',
        region: 'North East',
        cities: ['Gombe', 'Kaltungo', 'Dukku'],
        lgas: ['Gombe', 'Akko', 'Yamaltu/Deba', 'Funakaye', 'Kaltungo', 'Nafada', 'Shongom', 'Billiri', 'Dukku', 'Kumo', 'Balanga', 'Kwami']
    },
    {
        name: 'Jigawa',
        code: 'JI',
        region: 'North West',
        cities: ['Dutse', 'Hadejia', 'Kazaure'],
        lgas: ['Dutse', 'Hadejia', 'Kazaure', 'Birniwa', 'Guri', 'Gwaram', 'Gwiwa', 'Kiri Kasama', 'Kiyawa', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi']
    },
    {
        name: 'Katsina',
        code: 'KT',
        region: 'North West',
        cities: ['Katsina', 'Daura', 'Funtua'],
        lgas: ['Katsina', 'Daura', 'Funtua', 'Dutsin-Ma', 'Kankia', 'Ingawa', 'Zango', 'Mai\'Adua', 'Malumfashi', 'Kafur', 'Mashi', 'Bakori', 'Dan Musa', 'Kusada', 'Bindawa', 'Charanchi', 'Batsari', 'Kurfi', 'Safana', 'Dandume', 'Jibia', 'Kaita', 'Mani', 'Musawa', 'Rimi', 'Sandamu', 'Zango']
    },
    {
        name: 'Kebbi',
        code: 'KE',
        region: 'North West',
        cities: ['Birnin Kebbi', 'Argungu', 'Yauri'],
        lgas: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Dandi', 'Arewa Dandi', 'Bunza', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Wasagu/Danko', 'Zuru']
    },
    {
        name: 'Kogi',
        code: 'KO',
        region: 'North Central',
        cities: ['Lokoja', 'Okene', 'Idah'],
        lgas: ['Lokoja', 'Okene', 'Idah', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Igalamela-Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Mopa-Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Yagba East', 'Yagba West']
    },
    {
        name: 'Ondo',
        code: 'ON',
        region: 'South West',
        cities: ['Akure', 'Ondo', 'Owo'],
        lgas: ['Akure North', 'Akure South', 'Ondo East', 'Ondo West', 'Owo', 'Ose', 'Idanre', 'Ifedore', 'Ese Odo', 'Ilaje', 'Irele', 'Okitipupa', 'Odigbo', 'Ile Oluji/Okeigbo']
    },
    {
        name: 'Osun',
        code: 'OS',
        region: 'South West',
        cities: ['Osogbo', 'Ile-Ife', 'Ilesa'],
        lgas: ['Osogbo', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Ede North', 'Ede South', 'Ejigbo', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Atakunmosa East', 'Atakunmosa West']
    },
    {
        name: 'Sokoto',
        code: 'SO',
        region: 'North West',
        cities: ['Sokoto', 'Gusau', 'Tambuwal'],
        lgas: ['Sokoto North', 'Sokoto South', 'Wurno', 'Gada', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Yabo', 'Bodinga', 'Dange Shuni', 'Goronyo', 'Gudu', 'Gwadabawa', 'Kware']
    },
    {
        name: 'Taraba',
        code: 'TA',
        region: 'North East',
        cities: ['Jalingo', 'Wukari', 'Ibi'],
        lgas: ['Jalingo', 'Wukari', 'Takum', 'Ussa', 'Kurmi', 'Lau', 'Sardauna', 'Yorro', 'Zing', 'Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Karim Lamido']
    },
    {
        name: 'Yobe',
        code: 'YO',
        region: 'North East',
        cities: ['Damaturu', 'Potiskum', 'Gashua'],
        lgas: ['Damaturu', 'Potiskum', 'Gashua', 'Geidam', 'Bade', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Tarmuwa', 'Yunusari', 'Yusufari', 'Fika', 'Fune']
    },
    {
        name: 'Zamfara',
        code: 'ZA',
        region: 'North West',
        cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara'],
        lgas: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Zurmi', 'Maradun', 'Shinkafi', 'Bungudu', 'Tsafe', 'Anka', 'Bakura', 'Maru', 'Bukkuyum', 'Gummi']
    }
];

async function main() {
    // Create Nigeria
    const nigeria = await prisma.country.upsert({
        where: { code: 'NG' },
        update: {},
        create: {
            name: 'Nigeria',
            code: 'NG',
            currency: 'NGN',
            flagEmoji: '🇳🇬',
        },
    })

    let locationCount = 0;
    for (const nstate of nigerianStates) {
        console.log("Creating state " + nstate.name + "...")
        const state = await prisma.state.upsert({
            where: {
                name_countryId: {
                    name: nstate.name,
                    countryId: nigeria.id,
                },
            },
            update: {},
            create: {
                name: nstate.name,
                code: nstate.code,
                region: nstate.region,
                countryId: nigeria.id,
            },
        })

        console.log("Creating ciities for " + nstate.name + "...")
        for (const cityName of nstate.cities) {
            await prisma.city.upsert({
                where: {
                    name_stateId: {
                        name: cityName,
                        stateId: state.id,
                    },
                },
                update: {},
                create: { name: cityName, stateId: state.id },
            })
        }

        console.log("Creating lgas for " + nstate.name + "...")
        for (const lgaName of nstate.lgas) {
            await prisma.lGA.upsert({
                where: {
                    name_stateId: {
                        name: lgaName,
                        stateId: state.id,
                    },
                },
                update: {},
                create: { name: lgaName, stateId: state.id },
            })
        }
        locationCount++;

    }

    console.log(`✅ Seeded ${locationCount} locations for Nigeria`);
    //console.log('✅ Seed completed successfully.')
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
